import { ClientConfig } from 'pg';

export type Config = ClientConfig;

export type Jsonb = Record<string | number, Json> | Json[];
