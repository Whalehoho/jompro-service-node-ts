import { RSVP } from "~/database/data";
import pg from "./service";
import { toCamel, toDate } from "@/util";

const f: Record<keyof RSVP, string> = {
    rsvpId: 'rsvp_id',
    eventId: 'event_id',
    accountId: 'account_id',
    status: 'status',
};

const allFields = Object.values(f).map((a) => `${a} as ${toCamel(a)}`);

export async function create(): Promise<void> {
    if (!(await pg.schema.hasTable('rsvp'))) {
        await pg.schema.createTable('rsvp', function (table) {
            table.bigIncrements('rsvp_id').primary();
            table.string('event_id').notNullable();
            table.string('account_id').notNullable();
            table.string('status').notNullable();
        });
        await pg.raw("ALTER SEQUENCE rsvp_rsvp_id_seq RESTART WITH 1");
    }
}

export async function all(): Promise<RSVP[] | undefined> {
    return pg('rsvp').select(allFields);
}

export async function getById(rsvpId: string): Promise<RSVP | undefined> {
    return pg('rsvp').select(allFields).where('rsvp_id', '=', rsvpId).first();
}

export async function getByEventId(eventId: string): Promise<RSVP[] | undefined> {
    return pg('rsvp').select(allFields).where('event_id', '=', eventId);
}

export async function getApprovedByEventId(eventId: string): Promise<RSVP[] | undefined> {
    return pg('rsvp').select(allFields).where('event_id', '=', eventId).andWhere('status', '=', 'approved');
}

export async function getApprovedByAccountId(accountId: string): Promise<RSVP[] | undefined> {
    return pg('rsvp').select(allFields).where('account_id', '=', accountId).andWhere('status', '=', 'approved');
}

export async function getPendingByEventId(eventId: string): Promise<RSVP[] | undefined> {
    return pg('rsvp').select(allFields).where('event_id', '=', eventId).andWhere('status', '=', 'pending');
}

export async function getByAccountId(accountId: string): Promise<RSVP[] | undefined> {
    return pg('rsvp').select(allFields).where('account_id', '=', accountId);
}

export async function getByEventIdAndAccountId(eventId: string, accountId: string): Promise<RSVP | undefined> {
    return pg('rsvp').select(allFields).where('event_id', '=', eventId).andWhere('account_id', '=', accountId).first();
}

export async function getByEventIdAndStatus(eventId: string, status: string): Promise<RSVP[] | undefined> {
    return pg('rsvp').select(allFields).where('event_id', '=', eventId).andWhere('status', '=', status);
}

export async function getByAccountIdAndStatus(accountId: string, status: string): Promise<RSVP[] | undefined> {
    return pg('rsvp').select(allFields).where('account_id', '=', accountId).andWhere('status', '=', status);
}

export async function getByEventIdAndAccountIdAndStatus(eventId: string, accountId: string, status: string): Promise<RSVP | undefined> {
    return pg('rsvp').select(allFields).where('event_id', '=', eventId).andWhere('account_id', '=', accountId).andWhere('status', '=', status).first();
}

export async function insert(rsvp: RSVP): Promise<RSVP> {
    const query = pg('rsvp').insert({
        event_id: rsvp.eventId,
        account_id: rsvp.accountId,
        status: rsvp.status,
    }).returning('*');

    const result = (await query).pop();
    return {
        rsvpId: result.rsvp_id,
        eventId: result.event_id,
        accountId: result.account_id,
        status: result.status,
    }
}

export async function update(rsvp: RSVP): Promise<RSVP> {
    const query = pg('rsvp').insert({
        rsvp_id: rsvp.rsvpId,
        event_id: rsvp.eventId,
        account_id: rsvp.accountId,
        status: rsvp.status,
    }).onConflict('rsvp_id').merge().returning('*');

    const result = (await query).pop();
    return {
        rsvpId: result.rsvp_id,
        eventId: result.event_id,
        accountId: result.account_id,
        status: result.status,
    }
}

export async function approve(rsvpId: string): Promise<string> {
    const query = pg('rsvp').update({ status: 'approved' }).where('rsvp_id', '=', rsvpId).returning('rsvp_id');
    return (await query).pop();
}

export async function remove(rsvpId: string): Promise<void> {
    await pg('rsvp').delete().where('rsvp_id', '=', rsvpId);
}

export async function main(): Promise<void> {
    await create();
}

