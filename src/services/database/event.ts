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
    eventStatus: 'event_status',
    startTime: 'start_time',
    eventDuration: 'event_duration',
    eventLocation: 'event_location',
    maxParticipants: 'max_participants',
    genderRestriction: 'gender_restriction',
    ageRestriction: 'age_restriction',
    autoApprove: 'auto_approve',
};

const allFields = Object.values(f).map((a) => `${a} as ${toCamel(a)}`);

export async function create(): Promise<void> {
    if (!(await pg.schema.hasTable('EVENT_T'))) {
        await pg.schema.createTable('EVENT_T', function (table) {
            table.bigIncrements('event_id').primary();
            table.string('channel_id').notNullable();
            table.string('event_name').notNullable();
            table.text('event_about').notNullable();
            table.string('category').notNullable();
            table.string('organizer_id').notNullable();
            table.timestamp('created_at', { useTz: true }).defaultTo(pg.fn.now()).notNullable();
            table.string('event_status').notNullable();
            table.timestamp('start_time', { useTz: true }).notNullable();
            table.integer('event_duration').notNullable();
            table.jsonb('event_location').notNullable();
            table.integer('max_participants').notNullable();
            table.string('gender_restriction').notNullable();
            table.jsonb('age_restriction').notNullable();
            table.boolean('auto_approve').notNullable();

            // table.foreign('channel_id').references('channel_id').inTable('CHANNEL_T').onDelete('CASCADE');
            // table.foreign('organizer_id').references('user_id').inTable('USERS_T').onDelete('CASCADE');
        });
        // await pg.raw("ALTER SEQUENCE event_event_id_seq RESTART WITH 1");
    }
}

export async function all(): Promise<Event[] | undefined> {
    return pg('EVENT_T').select(allFields);
}

export async function allActive(userId: string): Promise<Event[] | undefined> {
    return pg('EVENT_T')
        .select(allFields)
        .where('event_status', '=', 'active')
        .andWhere('organizer_id', '!=', userId)
        .orderByRaw("COALESCE(event_location->>'region', '') NULLS FIRST, COALESCE(event_location->>'city', '')");
}

export async function getById(eventId: string): Promise<Event | undefined> {
    return pg('EVENT_T').select(allFields).where('event_id', '=', eventId).first();
}

export async function getByChannelId(channelId: string): Promise<Event[] | undefined> {
    return pg('EVENT_T').select(allFields).where('channel_id', '=', channelId);
}

export async function getByOrganizerId(organizerId: string): Promise<Event[] | undefined> {
    return pg('EVENT_T').select(allFields).where('organizer_id', '=', organizerId);
}

export async function getByChannelIdAndOrganizerId(channelId: string, organizerId: string): Promise<Event | undefined> {
    return pg('EVENT_T').select(allFields).where('channel_id', '=', channelId).andWhere('organizer_id', '=', organizerId).first();
}

export async function getByChannelIdAndStatus(channelId: string, eventStatus: string): Promise<Event[] | undefined> {
    return pg('EVENT_T').select(allFields).where('channel_id', '=', channelId).andWhere('event_status', '=', eventStatus);
}

export async function getByOrganizerIdAndStatus(organizerId: string, eventStatus: string): Promise<Event[] | undefined> {
    return pg('EVENT_T').select(allFields).where('organizer_id', '=', organizerId).andWhere('event_status', '=', eventStatus);
}

export async function getByChannelIdAndOrganizerIdAndStatus(channelId: string, organizerId: string, eventStatus: string): Promise<Event | undefined> {
    return pg('EVENT_T').select(allFields).where('channel_id', '=', channelId).andWhere('organizer_id', '=', organizerId).andWhere('event_status', '=', eventStatus).first();
}

export async function getActiveByChannelId(channelId: string): Promise<Event[] | undefined> {
    return pg('EVENT_T')
        .select(allFields)
        .where('channel_id', '=', channelId)
        .andWhere('event_status', '=', 'active')
        .orderBy('start_time', 'desc'); 
}

export async function getActiveByEventId(eventId: string): Promise<Event | undefined> {
    const query = pg('EVENT_T').select(allFields).where('event_id', '=', eventId).andWhere('event_status', '=', 'active');
    const result = (await query).pop();
    if(!result) return undefined;
    return {
        eventId: result.eventId,
        channelId: result.channelId,
        eventName: result.eventName,
        eventAbout: result.eventAbout,
        category: result.category,
        organizerId: result.organizerId,
        createdAt: result.createdAt,
        eventStatus: result.eventStatus,
        startTime: result.startTime,
        eventDuration: result.eventDuration,
        eventLocation: result.eventLocation,
        maxParticipants: result.maxParticipants,
        genderRestriction: result.genderRestriction,
        ageRestriction: result.ageRestriction,
        autoApprove: result.autoApprove
    };
}

export async function getActiveByOrganizerId(organizerId: string): Promise<Event[] | undefined> {
    const query = pg('EVENT_T').select(allFields).where('organizer_id', '=', organizerId).andWhere('event_status', '=', 'active');
    return (await query).map((result) => {
        return {
            eventId: result.eventId,
            channelId: result.channelId,
            eventName: result.eventName,
            eventAbout: result.eventAbout,
            category: result.category,
            organizerId: result.organizerId,
            createdAt: result.createdAt,
            eventStatus: result.eventStatus,
            startTime: result.startTime,
            eventDuration: result.eventDuration,
            eventLocation: result.eventLocation,
            maxParticipants: result.maxParticipants,
            genderRestriction: result.genderRestriction,
            ageRestriction: result.ageRestriction,
            autoApprove: result.autoApprove
        };
    });
}


export async function getByCity(city: string): Promise<Event[] | undefined> {
    return pg('EVENT_T').select(allFields).where('event_location->>city', '=', city);
}

export async function getByCategory(category: string): Promise<Event[] | undefined> {
    return pg('EVENT_T').select(allFields).where('category', '=', category);
}

export async function getActiveByCity(city: string): Promise<Event[] | undefined> {
    return pg('EVENT_T')
        .select(allFields)
        .where('event_location->>city', '=', city)
        .andWhere('event_status', '=', 'active')
        .orderByRaw("COALESCE(event_location->>'region', '') NULLS FIRST, COALESCE(event_location->>'city', '')");
}

export async function insert(event: Event): Promise<Event> {
    const [inserted] = await pg('EVENT_T')
        .insert({
            channel_id: event.channelId,
            event_name: event.eventName,
            event_about: event.eventAbout,
            category: event.category,
            organizer_id: event.organizerId,
            created_at: event.createdAt ? toDate(event.createdAt) : new Date(),
            event_status: event.eventStatus,
            start_time: toDate(event.startTime),
            event_duration: event.eventDuration,
            event_location: event.eventLocation,
            max_participants: event.maxParticipants,
            gender_restriction: event.genderRestriction,
            age_restriction: event.ageRestriction,
            auto_approve: event.autoApprove
        })
        .returning('event_id');

    return { ...event, eventId: inserted.event_id };
}


export async function update(event: Event): Promise<Event> {
    const query = pg('EVENT_T').insert({
        event_id: event.eventId,
        channel_id: event.channelId,
        event_name: event.eventName,
        event_about: event.eventAbout,
        category: event.category,
        organizer_id: event.organizerId,
        created_at: event.createdAt ? toDate(event.createdAt) : new Date(),
        event_status: event.eventStatus,
        start_time: toDate(event.startTime),
        event_duration: event.eventDuration,
        event_location: event.eventLocation,
        max_participants: event.maxParticipants,
        gender_restriction: event.genderRestriction,
        age_restriction: event.ageRestriction,
        auto_approve: event.autoApprove
    }).onConflict('event_id').merge().returning('*');

    const result = (await query).pop();
    return {
        eventId: result.event_id,
        channelId: result.channel_id,
        eventName: result.event_name,
        eventAbout: result.event_about,
        category: result.category,
        organizerId: result.organizer_id,
        createdAt: result.created_at,
        eventStatus: result.event_status,
        startTime: result.start_time,
        eventDuration: result.event_duration,
        eventLocation: result.event_location,
        maxParticipants: result.max_participants,
        genderRestriction: result.gender_restriction,
        ageRestriction: result.age_restriction,
        autoApprove: result.auto_approve
    };

}

export async function search(query: string): Promise<Event[] | undefined> {
    return pg('EVENT_T').select(allFields).where('event_name', 'ilike', `%${query}%`);
}


export async function main(): Promise<void> {
    await create();
}