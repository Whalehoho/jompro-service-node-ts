import { Subscription } from "~/database/data";
import pg from "./service";
import { toCamel, toDate } from "@/util";

const f: Record<keyof Subscription, string> = {
    subscriptionId: 'subscription_id',
    subscriberId: 'subscriber_id',
    channelId: 'channel_id',
    subscriptionStatus: 'subscription_status',
    subscribedAt: 'subscribed_at',
    unSubscribedAt: 'un_subscribed_at',
};

const allFields = Object.values(f).map((a) => `${a} as ${toCamel(a)}`);

export async function create(): Promise<void> {
    if (!(await pg.schema.hasTable('SUBSCRIPTION_T'))) {
        await pg.schema.createTable('SUBSCRIPTION_T', function (table) {
            table.bigIncrements('subscription_id').primary();
            table.string('subscriber_id').notNullable();
            table.string('channel_id').notNullable();
            table.string('subscription_status').notNullable();
            table.timestamp('subscribed_at', { useTz: true }).nullable();
            table.timestamp('un_subscribed_at', { useTz: true }).nullable();

            // Adding foreign key constraints
            // table.foreign('subscriber_id').references('user_id').inTable('USERS_T').onDelete('CASCADE');
            // table.foreign('channel_id').references('channel_id').inTable('CHANNEL_T').onDelete('CASCADE');
        });
        // await pg.raw("ALTER SEQUENCE subscription_subscription_id_seq RESTART WITH 1");
    }
}

export async function all(): Promise<Subscription[] | undefined> {
    return pg('SUBSCRIPTION_T').select(allFields);
}

export async function getById(subscriptionId: string): Promise<Subscription | undefined> {
    return pg('SUBSCRIPTION_T').select(allFields).where('subscription_id', '=', subscriptionId).first();
}

export async function getByChannelId(channelId: string): Promise<Subscription[] | undefined> {
    return pg('SUBSCRIPTION_T').select(allFields).where('channel_id', '=', channelId);
}

export async function getPendingByChannelId(channelId: string): Promise<Subscription[] | undefined> {
    return pg('SUBSCRIPTION_T').select(allFields).where('channel_id', '=', channelId).andWhere('subscription_status', '=', 'pending');
}

export async function getSubscribedByChannelId(channelId: string): Promise<Subscription[] | undefined> {
    return pg('SUBSCRIPTION_T').select(allFields).where('channel_id', '=', channelId).andWhere('subscription_status', '=', 'subscribed');
}

export async function getBySubscriberId(subscriberId: string): Promise<Subscription[] | undefined> {
    return pg('SUBSCRIPTION_T').select(allFields).where('subscriber_id', '=', subscriberId);
}

export async function getPendingBySubscriberId(subscriberId: string): Promise<Subscription[] | undefined> {
    return pg('SUBSCRIPTION_T').select(allFields).where('subscriber_id', '=', subscriberId).andWhere('subscription_status', '=', 'pending');
}

export async function getSubscribedBySubscriberId(subscriberId: string): Promise<Subscription[] | undefined> {
    return pg('SUBSCRIPTION_T').select(allFields).where('subscriber_id', '=', subscriberId).andWhere('subscription_status', '=', 'subscribed');
}

export async function getBySubscriberIdAndChannelId(subscriberId: string, channelId: string): Promise<Subscription | undefined> {
    return pg('SUBSCRIPTION_T').select(allFields).where('subscriber_id', '=', subscriberId).andWhere('channel_id', '=', channelId).first();
}

export async function insert(subscription: Subscription): Promise<Subscription> {
    const query = pg('SUBSCRIPTION_T').insert({
        subscriber_id: subscription.subscriberId,
        channel_id: subscription.channelId,
        subscription_status: subscription.subscriptionStatus,
        subscribed_at: subscription.subscribedAt ? toDate(subscription.subscribedAt) : null,
        un_subscribed_at: subscription.unSubscribedAt ? toDate(subscription.unSubscribedAt) : null,
    }).returning('*');
    const result = (await query).pop();
    return {
        subscriptionId: result.subscription_id,
        subscriberId: result.subscriber_id,
        channelId: result.channel_id,
        subscriptionStatus: result.subscription_status,
        subscribedAt: result.subscribed_at,
        unSubscribedAt: result.un_subscribed_at,
    }
}

export async function update(subscription: Subscription): Promise<Subscription> {
    const query = pg('SUBSCRIPTION_T').insert({
        subscription_id: subscription.subscriptionId,
        subscriber_id: subscription.subscriberId,
        channel_id: subscription.channelId,
        subscription_status: subscription.subscriptionStatus,
        subscribed_at: subscription.subscribedAt ? toDate(subscription.subscribedAt) : null,
        un_subscribed_at: subscription.unSubscribedAt ? toDate(subscription.unSubscribedAt) : null,
    }).onConflict('subscription_id').merge().returning('*');
    const result = (await query).pop();
    return {
        subscriptionId: result.subscription_id,
        subscriberId: result.subscriber_id,
        channelId: result.channel_id,
        subscriptionStatus: result.subscription_status,
        subscribedAt: result.subscribed_at,
        unSubscribedAt: result.un_subscribed_at,
    }
}

export async function approve(subscriptionId: string): Promise<string> {
    const query = pg('SUBSCRIPTION_T').update({ subscription_status: 'subscribed' }).where('subscription_id', '=', subscriptionId).returning('subscription_id');
    return (await query).pop();
}

export async function remove(subscriptionId: string): Promise<void> {
    await pg('SUBSCRIPTION_T').delete().where('subscription_id', '=', subscriptionId);
}

export async function main(): Promise<void> {
    await create();
}



