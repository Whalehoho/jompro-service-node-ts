import { Event } from "~/database/data";
import pg from './service';
import { toCamel, toDate } from '@/util';
import c from "config";
import e from "express";

const f: Record<keyof Event, string> = {
    eventId: 'event_id',
    channelId: 'channel_id',
    eventName: 'event_name',
    eventAbout: 'event_about',
    category: 'category',
    organizerId: 'organizer_id',
    createdAt: 'created_at',
    status: 'status',
    startTime: 'start_time',
    duration: 'duration',
    location: 'location',
    maxParticipants: 'max_participants',
    genderRestriction: 'gender_restriction',
    ageRestriction: 'age_restriction',
    autoApprove: 'auto_approve',
};

const allFields = Object.values(f).map((a) => `${a} as ${toCamel(a)}`);

export async function create(): Promise<void> {
    if (!(await pg.schema.hasTable('event'))) {
        await pg.schema.createTable('event', function (table) {
            table.bigIncrements('event_id').primary();
            table.string('channel_id').notNullable();
            table.string('event_name').notNullable();
            table.string('event_about').notNullable();
            table.string('category').notNullable();
            table.string('organizer_id').notNullable();
            table.timestamp('created_at', { useTz: true }).defaultTo(pg.fn.now()).notNullable();
            table.string('status').notNullable();
            table.timestamp('start_time', { useTz: true }).notNullable();
            table.integer('duration').notNullable();
            table.jsonb('location').notNullable();
            table.integer('max_participants').notNullable();
            table.string('gender_restriction').notNullable();
            table.jsonb('age_restriction').notNullable();
            table.boolean('auto_approve').notNullable();
        });
        await pg.raw("ALTER SEQUENCE event_event_id_seq RESTART WITH 1");
    }
}

export async function all(): Promise<Event[] | undefined> {
    return pg('event').select(allFields);
}

export async function allActive(accountId: string): Promise<Event[] | undefined> {
    return pg('event')
        .select(allFields)
        .where('status', '=', 'active')
        .andWhere('organizer_id', '!=', accountId)
        .orderByRaw("COALESCE(location->>'region', '') NULLS FIRST, COALESCE(location->>'city', '')");
}

export async function getById(eventId: string): Promise<Event | undefined> {
    return pg('event').select(allFields).where('event_id', '=', eventId).first();
}

export async function getByChannelId(channelId: string): Promise<Event[] | undefined> {
    return pg('event').select(allFields).where('channel_id', '=', channelId);
}

export async function getByOrganizerId(organizerId: string): Promise<Event[] | undefined> {
    return pg('event').select(allFields).where('organizer_id', '=', organizerId);
}

export async function getByChannelIdAndOrganizerId(channelId: string, organizerId: string): Promise<Event | undefined> {
    return pg('event').select(allFields).where('channel_id', '=', channelId).andWhere('organizer_id', '=', organizerId).first();
}

export async function getByChannelIdAndStatus(channelId: string, status: string): Promise<Event[] | undefined> {
    return pg('event').select(allFields).where('channel_id', '=', channelId).andWhere('status', '=', status);
}

export async function getByOrganizerIdAndStatus(organizerId: string, status: string): Promise<Event[] | undefined> {
    return pg('event').select(allFields).where('organizer_id', '=', organizerId).andWhere('status', '=', status);
}

export async function getByChannelIdAndOrganizerIdAndStatus(channelId: string, organizerId: string, status: string): Promise<Event | undefined> {
    return pg('event').select(allFields).where('channel_id', '=', channelId).andWhere('organizer_id', '=', organizerId).andWhere('status', '=', status).first();
}

export async function getActiveByChannelId(channelId: string): Promise<Event[] | undefined> {
    return pg('event')
        .select(allFields)
        .where('channel_id', '=', channelId)
        .andWhere('status', '=', 'active')
        .orderByRaw("COALESCE(location->>'region', '') NULLS FIRST, COALESCE(location->>'city', '')");
}

export async function getByCity(city: string): Promise<Event[] | undefined> {
    return pg('event').select(allFields).where('location->>city', '=', city);
}

export async function getByCategory(category: string): Promise<Event[] | undefined> {
    return pg('event').select(allFields).where('category', '=', category);
}

export async function getActiveByCity(city: string): Promise<Event[] | undefined> {
    return pg('event')
        .select(allFields)
        .where('location->>city', '=', city)
        .andWhere('status', '=', 'active')
        .orderByRaw("COALESCE(location->>'region', '') NULLS FIRST, COALESCE(location->>'city', '')");
}

export async function insert(event: Event): Promise<Event> {
    const eventId = await pg('event').insert({
        channel_id: event.channelId,
        event_name: event.eventName,
        event_about: event.eventAbout,
        category: event.category,
        organizer_id: event.organizerId,
        created_at: event.createdAt ? toDate(event.createdAt) : new Date(),
        status: event.status,
        start_time: toDate(event.startTime),
        duration: event.duration,
        location: event.location,
        max_participants: event.maxParticipants,
        gender_restriction: event.genderRestriction,
        age_restriction: event.ageRestriction,
        auto_approve: event.autoApprove
    }).returning('event_id');
    return { ...event, eventId: eventId[0] };
}

export async function update(event: Event): Promise<void> {
    const query = pg('event').insert({
        event_id: event.eventId,
        channel_id: event.channelId,
        event_name: event.eventName,
        event_about: event.eventAbout,
        category: event.category,
        organizer_id: event.organizerId,
        created_at: event.createdAt ? toDate(event.createdAt) : new Date(),
        status: event.status,
        start_time: toDate(event.startTime),
        duration: event.duration,
        location: event.location,
        max_participants: event.maxParticipants,
        gender_restriction: event.genderRestriction,
        age_restriction: event.ageRestriction,
        auto_approve: event.autoApprove
    }).onConflict('event_id').merge().returning('*');

    return (await query).pop();
}

export async function main(): Promise<void> {
    await create();
}