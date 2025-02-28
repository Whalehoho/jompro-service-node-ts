import { RSVP } from "~/database/data";
import pg from "./service";
import { toCamel, toDate } from "@/util";

const f: Record<keyof RSVP, string> = {
    rsvpId: 'rsvp_id',
    eventId: 'event_id',
    userId: 'user_id',
    rsvpStatus: 'rsvp_status',
};

const allFields = Object.values(f).map((a) => `${a} as ${toCamel(a)}`);

export async function create(): Promise<void> {
    if (!(await pg.schema.hasTable('RSVP_T'))) {
        await pg.schema.createTable('RSVP_T', function (table) {
            table.bigIncrements('rsvp_id').primary();
            table.string('event_id').notNullable();
            table.string('user_id').notNullable();
            table.string('rsvp_status').notNullable();

            // Adding foreign key constraints
            // table.foreign('user_id').references('user_id').inTable('USERS_T').onDelete('CASCADE');
            // table.foreign('event_id').references('event_id').inTable('EVENT_T').onDelete('CASCADE');
        });
        // await pg.raw("ALTER SEQUENCE rsvp_rsvp_id_seq RESTART WITH 1");
    }
}

export async function all(): Promise<RSVP[] | undefined> {
    return pg('RSVP_T').select(allFields);
}

export async function getById(rsvpId: string): Promise<RSVP | undefined> {
    return pg('RSVP_T').select(allFields).where('rsvp_id', '=', rsvpId).first();
}

export async function getByEventId(eventId: string): Promise<RSVP[] | undefined> {
    return pg('RSVP_T').select(allFields).where('event_id', '=', eventId);
}

export async function getApprovedByEventId(eventId: string): Promise<RSVP[] | undefined> {
    return pg('RSVP_T').select(allFields).where('event_id', '=', eventId).andWhere('rsvp_status', '=', 'approved');
}

export async function getApprovedByAccountId(userId: string): Promise<RSVP[] | undefined> {
    return pg('RSVP_T').select(allFields).where('user_id', '=', userId).andWhere('rsvp_status', '=', 'approved');
}

export async function getPendingByEventId(eventId: string): Promise<RSVP[] | undefined> {
    return pg('RSVP_T').select(allFields).where('event_id', '=', eventId).andWhere('rsvp_status', '=', 'pending');
}

export async function getByAccountId(userId: string): Promise<RSVP[] | undefined> {
    return pg('RSVP_T').select(allFields).where('user_id', '=', userId);
}

export async function getByEventIdAndAccountId(eventId: string, userId: string): Promise<RSVP | undefined> {
    return pg('RSVP_T').select(allFields).where('event_id', '=', eventId).andWhere('user_id', '=', userId).first();
}

export async function getByEventIdAndStatus(eventId: string, rsvpStatus: string): Promise<RSVP[] | undefined> {
    return pg('RSVP_T').select(allFields).where('event_id', '=', eventId).andWhere('rsvp_status', '=', rsvpStatus);
}

export async function getByAccountIdAndStatus(userId: string, rsvpStatus: string): Promise<RSVP[] | undefined> {
    return pg('RSVP_T').select(allFields).where('user_id', '=', userId).andWhere('rsvp_status', '=', rsvpStatus);
}

export async function getByEventIdAndAccountIdAndStatus(eventId: string, userId: string, rsvpStatus: string): Promise<RSVP | undefined> {
    return pg('RSVP_T').select(allFields).where('event_id', '=', eventId).andWhere('user_id', '=', userId).andWhere('rsvp_status', '=', rsvpStatus).first();
}

export async function insert(rsvp: RSVP): Promise<RSVP> {
    const query = pg('RSVP_T').insert({
        event_id: rsvp.eventId,
        user_id: rsvp.userId,
        rsvp_status: rsvp.rsvpStatus,
    }).returning('*');

    const result = (await query).pop();
    return {
        rsvpId: result.rsvp_id,
        eventId: result.event_id,
        userId: result.user_id,
        rsvpStatus: result.rsvp_status,
    }
}

export async function update(rsvp: RSVP): Promise<RSVP> {
    const query = pg('RSVP_T').insert({
        rsvp_id: rsvp.rsvpId,
        event_id: rsvp.eventId,
        user_id: rsvp.userId,
        rsvp_status: rsvp.rsvpStatus,
    }).onConflict('rsvp_id').merge().returning('*');

    const result = (await query).pop();
    return {
        rsvpId: result.rsvp_id,
        eventId: result.event_id,
        userId: result.user_id,
        rsvpStatus: result.rsvp_status,
    }
}

export async function approve(rsvpId: string): Promise<string> {
    const query = pg('RSVP_T').update({ rsvp_status: 'approved' }).where('rsvp_id', '=', rsvpId).returning('rsvp_id');
    return (await query).pop();
}

export async function remove(rsvpId: string): Promise<void> {
    await pg('RSVP_T').delete().where('rsvp_id', '=', rsvpId);
}

export async function main(): Promise<void> {
    await create();
}

