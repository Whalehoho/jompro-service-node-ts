import { Knex, knex } from 'knex';
import config from 'config';
import { Config } from '@/types/database';
import { types } from 'pg';
import dayjs from 'dayjs';

const pgConfig = config.get<Config>('postgres');

types.setTypeParser(types.builtins.NUMERIC, parseFloat);
types.setTypeParser(types.builtins.INT8, parseInt);
types.setTypeParser(types.builtins.TIMESTAMPTZ, (str) => {
    return dayjs.utc(str).unix();
});
types.setTypeParser(types.builtins.TIMESTAMP, (str) => {
    return dayjs.utc(str).unix();
});

const client = knex({
    client: 'pg',
    connection: {
        host: pgConfig.host,
        port: pgConfig.port,
        user: pgConfig.user,
        database: pgConfig.database,
        password: pgConfig.password,
    },
    pool: { min: 1, max: 5 },
});

export default client;
