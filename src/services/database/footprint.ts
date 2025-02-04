import { Footprint } from '~/database/data';
import pg from './service';
import { toCamel, toDate } from '@/util';

const f: Record<keyof Footprint, string> = {
    accountId: 'account_id',
    loggedAt: 'logged_at',
    action: 'action',
};

const allFields = Object.values(f).map((a) => `${a} as ${toCamel(a)}`);

export async function create(): Promise<void> {
    if (!(await pg.schema.hasTable('footprint'))) {
        await pg.schema.createTable('footprint', function (table) {
            table.string('account_id').notNullable();
            table.timestamp('logged_at', { useTz: true }).notNullable();
            table.string('action').notNullable();
        });
    }
}

export async function insert(footprint: Footprint): Promise<void> {
    await pg('footprint').insert({
        account_id: footprint.accountId,
        logged_at: toDate(footprint.loggedAt),
        action: footprint.action,
    });
}

export async function main(): Promise<void> {
    await create();
}
