import { DemoStatus } from '@/types/redis/demo';
import redis from './index';

const demo_key = (): string => `${redis.namespace}:demo`;

export function get(): Promise<DemoStatus | undefined> {
    return redis.get<DemoStatus>(demo_key());
}

export async function set(value: DemoStatus): Promise<void> {
    await redis.set(demo_key(), value);
}
