import { EventInstance } from '~/database/data';
import pg from './service';
import { toCamel, toDate } from '@/util';

const f: Record<keyof EventInstance, string> = {
    eventId: 'event_id',
    instanceId: 'instance_id',
    instanceName: 'instance_name',
    instanceDesc: 'instance_desc',
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
    if (!(await pg.schema.hasTable('event_instance'))) {
        await pg.schema.createTable('event_instance', function (table) {
            table.bigIncrements('instance_id').primary();
            table.string('event_id').notNullable();
            table.string('instance_name').notNullable();
            table.string('instance_desc').notNullable();
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
        await pg.raw("ALTER SEQUENCE event_instance_instance_id_seq RESTART WITH 1");
    }
}

export async function all(): Promise<EventInstance[] | undefined> {
    return pg('event_instance').select(allFields);
}

export async function getById(instanceId: string): Promise<EventInstance | undefined> {
    return pg('event_instance').select(allFields).where('instance_id', '=', instanceId).first();
}

export async function getByEventId(eventId: string): Promise<EventInstance[] | undefined> {
    return pg('event_instance').select(allFields).where('event_id', '=', eventId);
}

export async function getByOrganizerId(organizerId: string): Promise<EventInstance[] | undefined> {
    return pg('event_instance').select(allFields).where('organizer_id', '=', organizerId);
}

export async function getByParticipantId(participantId: string): Promise<EventInstance[] | undefined> {
    return pg('event_instance').select(allFields).where('participants', '@>', [{ participantId }]);
}

// export async function getByLocation(location: { fullAddress: string, city: string, region: string, lat: number, lng: number }): Promise<EventInstance[] | undefined> {
//     return pg('event_instance').select(allFields).where('location', '=', location);
// }

export async function getByCity(city: string): Promise<EventInstance[] | undefined> {
    return pg('event_instance').select(allFields).where('location->>city', '=', city);
}

export async function update(eventInstance: EventInstance): Promise<EventInstance> {
    const query = pg('event_instance').insert({
        event_id: eventInstance.eventId,
        instance_name: eventInstance.instanceName,
        instance_desc: eventInstance.instanceDesc,
        organizer_id: eventInstance.organizerId,
        created_at: toDate(eventInstance.createdAt),
        status: eventInstance.status,
        start_time: toDate(eventInstance.startTime),
        duration: eventInstance.duration,
        location: eventInstance.location,
        max_participants: eventInstance.maxParticipants,
        participants: eventInstance.participants,
        genderRestriction: eventInstance.genderRestriction,
        ageRestriction: eventInstance.ageRestriction,
        auto_approve: eventInstance.autoApprove
    }).onConflict('instance_id').merge().returning('*');

    return (await query).pop();
}

export async function remove(instanceId: string): Promise<void> {
    await pg('event_instance').where('instance_id', '=', instanceId).del();
}

export async function updateStatus(instanceId: string, status: string): Promise<EventInstance> {
    const query = pg('event_instance').where('instance_id', '=', instanceId).update({
        status: status,
    }).returning('*');

    return (await query).pop();
}

export async function addParticipant(instanceId: string, participantId: string): Promise<EventInstance> {
    const query = pg('event_instance').where('instance_id', '=', instanceId).update({
        participants: pg.raw(`
            COALESCE(participants, ARRAY[]::jsonb[]) || ?
        `, [JSON.stringify({ participantId, status: 'pending' })]),
    }).returning('*');

    return (await query).pop();
}

export async function removeParticipant(instanceId: string, participantId: string): Promise<EventInstance> {
    const query = pg('event_instance').where('instance_id', '=', instanceId).update({
        participants: pg.raw(`
            array_remove(participants, ?)
        `, [participantId]),
    }).returning('*');

    return (await query).pop();
}

export async function updateParticipantStatus(instanceId: string, participantId: string, status: string): Promise<EventInstance> {
    const query = pg('event_instance').where('instance_id', '=', instanceId).update({
        participants: pg.raw(`
            jsonb_set(participants, '{${participantId}}', ?)
        `, [JSON.stringify({ participantId, status })]),
    }).returning('*');

    return (await query).pop();
}

export async function main(): Promise<void> {
    await create();
}