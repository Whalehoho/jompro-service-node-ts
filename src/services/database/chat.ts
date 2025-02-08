import { Chat } from "~/database/data";
import pg from './service';
import { toCamel, toDate } from '@/util';
import { result } from "lodash";

const f: Record<keyof Chat, string> = {
    chatId: 'chat_id',
    channelId: 'channel_id',
    senderId: 'sender_id',
    message: 'message',
    sentAt: 'sent_at',
};

const allFields = Object.values(f).map((a) => `${a} as ${toCamel(a)}`);

export async function create(): Promise<void> {
    if (!(await pg.schema.hasTable('chat'))) {
        await pg.schema.createTable('chat', function (table) {
            table.bigIncrements('chat_id').primary();
            table.string('channel_id').notNullable();
            table.string('sender_id').notNullable();
            table.text('message').notNullable();
            table.timestamp('sent_at', { useTz: true }).defaultTo(pg.fn.now()).notNullable();
        });
        await pg.raw("ALTER SEQUENCE chat_chat_id_seq RESTART WITH 1");
    }
}

export async function getHistoryChannelId(channelId: string): Promise<Chat[] | undefined> {
    const query = pg('chat').select(allFields).where('channel_id', '=', channelId).orderBy('sent_at', 'asc');
    return (await query).map((result) => {
        return {
            chatId: result.chatId,
            channelId: result.channelId,
            senderId: result.senderId,
            message: result.message,
            sentAt: result.sentAt,
        };
    });
}

export async function insert(chat: Chat): Promise<string> {
    const result = await pg('chat').insert({
        channel_id: chat.channelId,
        sender_id: chat.senderId,
        message: chat.message,
    }).returning('chat_id');
    return result[0];
}

export async function main(): Promise<void> {
    await create();
}