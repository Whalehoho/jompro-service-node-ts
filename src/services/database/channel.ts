import { Channel } from '~/database/data';
import pg from './service';
import { toCamel, toDate  } from '@/util';

const f: Record<keyof Channel, string> = {
    channelId: 'channel_id',
    channelName: 'channel_name',
    channelDesc: 'channel_desc',
    channelPrivacy: 'channel_privacy',
    ownerId: 'owner_id',
    category: 'category',
    createdAt: 'created_at',
};

const allFields = Object.values(f).map((a) => `${a} as ${toCamel(a)}`);

export async function create(): Promise<void> {
    if (!(await pg.schema.hasTable('CHANNEL_T'))) {
        await pg.schema.createTable('CHANNEL_T', function (table) {
            table.bigIncrements('channel_id').primary();
            table.string('channel_name').notNullable();
            table.text('channel_desc').notNullable();
            table.string('channel_privacy').notNullable();
            table.string('owner_id').notNullable();
            table.string('category').notNullable();
            table.timestamp('created_at', { useTz: true }).defaultTo(pg.fn.now()).notNullable();

            // table.foreign('owner_id').references('user_id').inTable('USERS_T').onDelete('CASCADE');
        });
        // await pg.raw("ALTER SEQUENCE event_event_id_seq RESTART WITH 1");
    }
}

export async function all(): Promise<Channel[] | undefined> {
    return pg('CHANNEL_T').select(allFields);
}

export async function getById(channelId: string): Promise<Channel | undefined> {
    return pg('CHANNEL_T').select(allFields).where('channel_id', '=', channelId).first();
}

export async function getByOwnerId(ownerId: string): Promise<Channel[] | undefined> {
    return pg('CHANNEL_T').select(allFields).where('owner_id', '=', ownerId);
}

export async function getByCategory(category: string): Promise<Channel[] | undefined> {
    return pg('CHANNEL_T').select(allFields).where('category', '=', category);
}

export async function getByPrivacy(channelPrivacy: string): Promise<Channel[] | undefined> {
    return pg('CHANNEL_T').select(allFields).where('channel_privacy', '=', channelPrivacy);
}

export async function getByCategoryAndPrivacy(category: string, channelPrivacy: string): Promise<Channel[] | undefined> {
    return pg('CHANNEL_T').select(allFields).where('category', '=', category).andWhere('channel_privacy', '=', channelPrivacy);
}

export async function getByOwnerAndCategory(ownerId: string, category: string): Promise<Channel[] | undefined> {
    return pg('CHANNEL_T').select(allFields).where('owner_id', '=', ownerId).andWhere('category', '=', category);
}

export async function getByOwnerAndPrivacy(ownerId: string, channelPrivacy: string): Promise<Channel[] | undefined> {
    return pg('CHANNEL_T').select(allFields).where('owner_id', '=', ownerId).andWhere('channel_privacy', '=', channelPrivacy);
}

export async function getByOwnerAndCategoryAndPrivacy(ownerId: string, category: string, channelPrivacy: string): Promise<Channel[] | undefined> {
    return pg('CHANNEL_T').select(allFields).where('owner_id', '=', ownerId).andWhere('category', '=', category).andWhere('channel_privacy', '=', channelPrivacy);
}

export async function getPublic(): Promise<Channel[] | undefined> {
    return pg('CHANNEL_T').select(allFields).where('channel_privacy', '=', 'public');
}

export async function getPrivate(): Promise<Channel[] | undefined> {
    return pg('CHANNEL_T').select(allFields).where('channel_privacy', '=', 'private');
}

export async function insert(channel: Channel): Promise<Channel> {
    const query = pg('CHANNEL_T').insert({
        channel_id: channel.channelId,
        channel_name: channel.channelName,
        channel_desc: channel.channelDesc,
        channel_privacy: channel.channelPrivacy,
        owner_id: channel.ownerId,
        category: channel.category,
        created_at: channel.createdAt? toDate(channel.createdAt): new Date(),
    }).returning('*');
    return (await query).pop();
}

export async function update(channel: Channel): Promise<Channel> {
    const query = pg('CHANNEL_T').insert({
        channel_id: channel.channelId,
        channel_name: channel.channelName,
        channel_desc: channel.channelDesc,
        channel_privacy: channel.channelPrivacy,
        owner_id: channel.ownerId,
        category: channel.category,
        created_at: channel.createdAt? toDate(channel.createdAt): new Date(),
    }).onConflict('channel_id').merge().returning('*');
    return (await query).pop();
}

export async function remove(channelId: string): Promise<void> {
    await pg('CHANNEL_T').where('channel_id', '=', channelId).del();
}

export async function updatePrivacy(channelId: string, channelPrivacy: string): Promise<Channel> {
    const query = pg('CHANNEL_T').where('channel_id', '=', channelId).update({
        channel_privacy: channelPrivacy,
    }).returning('*');
    return (await query).pop();
}

export async function search(query: string): Promise<Channel[] | undefined> {
    return pg('CHANNEL_T').select(allFields).where('channel_name', 'ilike', `%${query}%`);
}


export async function main(): Promise<void> {
    await create();
}



