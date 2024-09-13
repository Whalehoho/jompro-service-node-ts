import { Event } from '~/database/data';
import pg from './service';
import { toCamel, toDate } from '@/util';

const f: Record<keyof Event, string> = {
    eventId: 'event_id',
    hostId: 'host_id',
    coHosts: 'co_hosts',
    category: 'category',
    eventName: 'event_name',
    eventDesc: 'event_desc',
    pattern: 'pattern',
    createdAt: 'created_at',
    status: 'status',
};

const allFields = Object.values(f).map((a) => `${a} as ${toCamel(a)}`);

export async function create(): Promise<void> {
    if (!(await pg.schema.hasTable('event'))) {
        await pg.schema.createTable('event', function (table) {
            table.bigIncrements('event_id').primary();
            table.string('host_id').notNullable();
            table.specificType('co_hosts', 'text[]').nullable();
            table.string('category').notNullable();
            table.string('event_name').notNullable();
            table.string('event_desc').notNullable();
            table.string('pattern').notNullable();
            table.timestamp('created_at', { useTz: true }).defaultTo(pg.fn.now()).notNullable();
            table.string('status').notNullable();
        });
        await pg.raw("ALTER SEQUENCE event_event_id_seq RESTART WITH 1");
    }
}

export async function all(): Promise<Event[] | undefined> {
    return pg('event').select(allFields);
}

export async function getById(eventId: string): Promise<Event | undefined> {
    return pg('event').select(allFields).where('event_id', '=', eventId).first();
}

export async function getByHostId(hostId: string): Promise<Event[] | undefined> {
    return pg('event').select(allFields).where('host_id', '=', hostId);
}

export async function getByCategory(category: string): Promise<Event[] | undefined> {
    return pg('event').select(allFields).where('category', '=', category);
}

export async function update(event: Event): Promise<Event> {
    const query = pg('event').insert({
        event_id: event.eventId,
        host_id: event.hostId,
        co_hosts: event.coHosts,
        category: event.category,
        event_name: event.eventName,
        event_desc: event.eventDesc,
        pattern: event.pattern,
        created_at: toDate(event.createdAt),
        status: event.status,
    }).onConflict('event_id').merge().returning('*');
    
    return (await query).pop();
}

export async function remove(eventId: string): Promise<void> {
    await pg('event').where('event_id', '=', eventId).del();
}

export async function updateStatus(eventId: string, status: string): Promise<Event> {
    const query = pg('event').where('event_id', '=', eventId).update({
        status: status,
    }).returning('*');
    
    return (await query).pop();
}

export async function addCoHost(eventId: string, coHostId: string): Promise<Event> {
    const query = pg('event').where('event_id', '=', eventId).update({
        co_hosts: pg.raw(`
            COALESCE(co_hosts, ARRAY[]::text[]) || ?
        `, [coHostId]),
    }).returning('*');
    
    return (await query).pop();
}

export async function removeCoHost(eventId: string, coHostId: string): Promise<Event> {
    const query = pg('event').where('event_id', '=', eventId).update({
        co_hosts: pg.raw(`
            array_remove(co_hosts, ?)
        `, [coHostId]),
    }).returning('*');
    
    return (await query).pop();
}

export async function main(): Promise<void> {
    await create();
}
