import type { RedisOptions } from 'ioredis';

export type Config = RedisOptions & { namespace?: string };

export type Subscriber = (channel: string, message: string) => any;
export type PSubscriber = (pattern: string, channel: string, message: string) => any;
