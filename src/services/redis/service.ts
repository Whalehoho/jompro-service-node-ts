import type { Subscriber, PSubscriber } from '~/redis';

import logger, { LogLevel } from 'logger';
import IORedis, { RedisOptions } from 'ioredis';
import c from 'config';

const log = logger('REDIS');

export default class RedisService {
    readonly db: string;
    readonly namespace: string;

    readonly client: IORedis;
    private readonly subscriber: IORedis;
    private readonly subscribers: { [channel: string]: Subscriber[] } = {};
    private readonly psubscribers: { [pattern: string]: PSubscriber[] } = {};

    constructor(options: RedisOptions = {}, namespace = 'redis', minLevel?: LogLevel) {
        console.log('RedisService', options, namespace, minLevel);
        if (minLevel) log.setLogLevel(minLevel);

        this.namespace = namespace;
        this.client = new IORedis(options);
        this.subscriber = new IORedis(options);

        this.db = (this.client.options.db ?? 0).toString();

        this.subscriber.on('message', (channel, message) => {
            log.debug('message', { channel, message });
            this.subscribers[channel]?.forEach((subscriber) => subscriber(channel, message));
        });

        this.subscriber.on('pmessage', (pattern, channel, message) => {
            log.debug('pmessage', { pattern, channel, message });
            // console.log('pmessage', { pattern, channel, message });
            this.psubscribers[pattern]?.forEach((subscriber) => subscriber(pattern, channel, message));
        });


        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        this.client.config('SET', 'notify-keyspace-events', 'KEA').then(() => log.info('keyspace-events enabled'));

        this.client.on('error', log.fatal);
        this.subscriber.on('error', log.fatal);
    }

    async keys(pattern: string): Promise<string[]> {
        return (await this.client.keys(pattern)) ?? [];
    }

    async set<T extends Json>(key: string, value: T): Promise<'OK' | null> {
        return this.client.set(key, JSON.stringify(value));
    }

    async setex<T extends Json>(key: string, ttl: number, value: T): Promise<'OK' | null> {
        return this.client.setex(key, ttl, JSON.stringify(value));
    }

    async get<T extends Json>(key: string): Promise<T | undefined> {
        const data = await this.client.get(key);
        return data == null ? undefined : JSON.parse(data);
    }

    async hkeys(key: string): Promise<string[]> {
        return (await this.client.hkeys(key)) ?? [];
    }

    async hset<T extends Json>(key: string, field: string, value: T): Promise<number> {
        return this.client.hset(key, field, JSON.stringify(value));
    }

    // Uses hset to perform multiple-set as hmset is no longer preferred https://redis.io/commands/HMSET
    async hmset<T extends Record<string, Json>>(key: string, values: T, clean = false): Promise<number> {
        if (clean) await this.del(key);

        return this.client.hset(
            key,
            ...Object.entries(values)
                .map(([field, value]) => [field, JSON.stringify(value)])
                .flat()
        );
    }

    async hsetnx<T extends Json>(key: string, field: string, value: T): Promise<T> {
        const set = await this.client.hsetnx(key, field, JSON.stringify(value));
        return set ? value : (await this.hget(key, field))!;
    }

    async hget<T extends Json>(key: string, field: string): Promise<T | undefined> {
        const data = await this.client.hget(key, field);
        return data == null ? undefined : JSON.parse(data);
    }

    async hgetall<T extends Record<string, Json>>(key: string): Promise<T | undefined> {
        const data = await this.client.hgetall(key);
        if (!data || !Object.keys(data).length) return undefined;
        return Object.fromEntries(Object.entries(data).map(([key, value]) => [key, !value? value : JSON.parse(value)])) as T;
    }

    async hdel(key: string, field: string): Promise<number> {
        return this.client.hdel(key, field);
    }

    async hlen(key: string): Promise<number> {
        return this.client.hlen(key);
    }

    async del(...keys: string[]): Promise<number> {
        return this.client.del(keys);
    }

    async exists(...keys: string[]): Promise<number> {
        return this.client.exists(keys);
    }

    async llen(key: string): Promise<number> {
        return this.client.llen(key);
    }

    async lpush<T extends Json>(key: string, value: T): Promise<number> {
        return this.client.lpush(key, JSON.stringify(value));
    }

    async lpop<T extends Json>(key: string): Promise<T | undefined> {
        const data = await this.client.lpop(key);
        return data == null ? undefined : JSON.parse(data);
    }

    async mget<T extends Json>(...keys: string[]): Promise<(T | undefined)[]> {
        const data = await this.client.mget(keys);
        console.log(keys, data);
        return data.map((value) => (value == null ? undefined : JSON.parse(value)));
    }

    async rpush<T extends Json>(key: string, value: T): Promise<number> {
        return this.client.rpush(key, JSON.stringify(value));
    }

    async rpop<T extends Json>(key: string): Promise<T | undefined> {
        const data = await this.client.rpop(key);
        return data == null ? undefined : JSON.parse(data);
    }

    async subscribe(channel: string, subscriber: Subscriber): Promise<void> {
        console.log('Channel', channel);
        if (!this.subscribers[channel]) {
            this.subscribers[channel] = [];
            await this.subscriber.subscribe(channel);
        }

        this.subscribers[channel].push(subscriber);
    }

    async unsubscribe(channel: string, subscriber: Subscriber): Promise<void> {
        if (!this.subscribers[channel]) {
            log.warn(`Attempting to unsubscribe from unsubscribed channel ${channel}`);
            return;
        }

        const index = this.subscribers[channel].indexOf(subscriber);

        if (index === -1) log.error(`Subscriber not found in channel ${channel}`);
        else {
            this.subscribers[channel].splice(index, 1);
            await this.subscriber.unsubscribe(channel).then(() => delete this.subscribers[channel]);
        }
    }

    async psubscribe(pattern: string, subscriber: PSubscriber): Promise<void> {
        if (!this.psubscribers[pattern]) {
            this.psubscribers[pattern] = [];
            await this.subscriber.psubscribe(pattern);
        }

        this.psubscribers[pattern].push(subscriber);
    }

    async punsubscribe(pattern: string, subscriber: PSubscriber): Promise<void> {
        if (!this.psubscribers[pattern]) {
            log.warn(`Attempting to punsubscribe from unsubscribed pattern ${pattern}`);
            return;
        }

        const index = this.psubscribers[pattern].indexOf(subscriber);

        if (index === -1) log.error(`PSubscriber not found in pattern ${pattern}`);
        else {
            this.psubscribers[pattern].splice(index, 1);
            if (!this.psubscribers[pattern].length) {
                await this.subscriber.punsubscribe(pattern).then(() => delete this.psubscribers[pattern]);
            }
        }
    }
}
