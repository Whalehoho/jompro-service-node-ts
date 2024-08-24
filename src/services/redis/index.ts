import type { Config } from '~/redis';

import config from 'config';
import RedisService from './service';
import { memoizeDebounce } from '@/util';
import logger, { LogLevel } from 'logger';

const { namespace, ...options } = config.get<Config>('redis');

const minLevel = <LogLevel>process.env.REDIS_LOG_LEVEL || 'info';

const log = logger('REDIS').setLogLevel(minLevel);

const redis = new RedisService(options, namespace, minLevel);

export default redis;

// export async function subscribe(pattern: string, subscriber: (key: string, event?: string) => any): Promise<void> {
//     try {
//         const callback = memoizeDebounce(subscriber, 0, { maxWait: 1000 });

//         await redis.psubscribe(`__keyevent@${redis.db}__:` + pattern, (_, key, event) => callback(key, event));
//         (await redis.keys(pattern)).forEach((key) => subscriber(key));
//     } catch (e) {
//         log.error(e);
//     }
// }

export async function subscribe(pattern: string, subscriber: (key: string, event?: string) => any): Promise<void> {
    try {
        await redis.psubscribe(`__keyevent@${redis.db}__:` + pattern, (_, key, event) => {
            subscriber(key, event);
        });

        const keys = await redis.keys(pattern);
        keys.forEach((key) => subscriber(key));
    } catch (e) {
        console.error(e);
    }
}


export * as demo from './demo';
