import { Session } from '~/database/data';
import pg from './service';
import { toCamel, toDate } from '@/util';

const f: Record<keyof Session, string> = {
    eventId: 'event_id',
    sessionId: 'session_id',
    sessionName: 'session_name',
    sessionDesc: 'session_desc',
    organizerId: 'organizer_id',
    createdAt: 'created_at',
    status: 'status',
    startTime: 'start_time',
    duration: 'duration',
    location: 'location',
    maxParticipants: 'max_participants',
    participants: 'participants',
    genderRestriction: 'gender_restriction',
    ageRestriction: 'age_restriction',
    autoApprove: 'auto_approve'
};

const allFields = Object.values(f).map((a) => `${a} as ${toCamel(a)}`);

export async function create(): Promise<void> {
    if (!(await pg.schema.hasTable('session'))) {
        await pg.schema.createTable('session', function (table) {
            table.bigIncrements('session_id').primary();
            table.string('event_id').notNullable();
            table.string('session_name').notNullable();
            table.string('session_desc').notNullable();
            table.string('organizer_id').notNullable();
            table.timestamp('created_at', { useTz: true }).defaultTo(pg.fn.now()).notNullable();
            table.string('status').notNullable();
            table.timestamp('start_time', { useTz: true }).notNullable();
            table.integer('duration').notNullable();
            table.jsonb('location').notNullable();
            table.integer('max_participants').notNullable();
            table.jsonb('participants').nullable();
            table.string('gender_restriction').notNullable();
            table.jsonb('age_restriction').notNullable();
            table.boolean('auto_approve').notNullable();
        });
        await pg.raw("ALTER SEQUENCE session_session_id_seq RESTART WITH 1");
    }
}

export async function all(): Promise<Session[] | undefined> {
    return pg('session').select(allFields);
}

export async function allActive(): Promise<Session[] | undefined> {
    return pg('session').select(allFields).where('status', '=', 'active');
}

export async function getActiveByEventId(eventId: string): Promise<Session[] | undefined> {
    return pg('session').select(allFields).where('event_id', '=', eventId).andWhere('status', '=', 'active');
}

export async function getById(sessionId: string): Promise<Session | undefined> {
    return pg('session').select(allFields).where('session_id', '=', sessionId).first();
}

export async function getAllByEventId(eventId: string): Promise<Session[] | undefined> {
    return pg('session').select(allFields).where('event_id', '=', eventId);
}

export async function getByOrganizerId(organizerId: string): Promise<Session[] | undefined> {
    return pg('session').select(allFields).where('organizer_id', '=', organizerId);
}

export async function getByParticipantId(participantId: string): Promise<Session[] | undefined> {
    return pg('session').select(allFields).where('participants', '@>', [{ participantId }]);
}

// export async function getByLocation(location: { fullAddress: string, city: string, region: string, lat: number, lng: number }): Promise<Session[] | undefined> {
//     return pg('session').select(allFields).where('location', '=', location);
// }

export async function getByCity(city: string): Promise<Session[] | undefined> {
    return pg('session').select(allFields).where('location->>city', '=', city);
}

export async function update(session: Session): Promise<Session> {
    const query = pg('session').insert({
        event_id: session.eventId,
        session_id: session.sessionId,
        session_name: session.sessionName,
        session_desc: session.sessionDesc,
        organizer_id: session.organizerId,
        created_at: session.createdAt? toDate(session.createdAt) : new Date(),
        status: session.status,
        start_time: toDate(session.startTime),
        duration: session.duration,
        location: session.location,
        max_participants: session.maxParticipants,
        participants: session.participants,
        gender_restriction: session.genderRestriction,
        age_restriction: session.ageRestriction,
        auto_approve: session.autoApprove
    }).onConflict('session_id').merge().returning('*');

    return (await query).pop();
}

export async function remove(sessionId: string): Promise<void> {
    await pg('session').where('session_id', '=', sessionId).del();
}

export async function updateStatus(sessionId: string, status: string): Promise<Session> {
    const query = pg('session').where('session_id', '=', sessionId).update({
        status: status,
    }).returning('*');

    return (await query).pop();
}

export async function addParticipant(sessionId: string, participantId: string): Promise<Session> {
    const query = pg('session').where('session_id', '=', sessionId).update({
        participants: pg.raw(`
            COALESCE(participants, ARRAY[]::jsonb[]) || ?
        `, [JSON.stringify({ participantId, status: 'pending' })]),
    }).returning('*');

    return (await query).pop();
}

export async function removeParticipant(sessionId: string, participantId: string): Promise<Session> {
    const query = pg('session').where('session_id', '=', sessionId).update({
        participants: pg.raw(`
            array_remove(participants, ?)
        `, [participantId]),
    }).returning('*');

    return (await query).pop();
}

export async function updateParticipantStatus(sessionId: string, participantId: string, status: string): Promise<Session> {
    const query = pg('session').where('session_id', '=', sessionId).update({
        participants: pg.raw(`
            jsonb_set(participants, '{${participantId}}', ?)
        `, [JSON.stringify({ participantId, status })]),
    }).returning('*');

    return (await query).pop();
}

export async function main(): Promise<void> {
    await create();
}