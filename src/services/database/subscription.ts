import { Subscription } from "~/database/data";
import pg from "./service";
import { toCamel, toDate } from "@/util";

const f: Record<keyof Subscription, string> = {
    subscriptionId: 'subscription_id',
    subscriberId: 'subscriber_id',
    channelId: 'channel_id',
    status: 'status',
    subscribedAt: 'subscribed_at',
    unSubscribedAt: 'un_subscribed_at',
};

const allFields = Object.values(f).map((a) => `${a} as ${toCamel(a)}`);

export async function create(): Promise<void> {
    if (!(await pg.schema.hasTable('subscription'))) {
        await pg.schema.createTable('subscription', function (table) {
            table.bigIncrements('subscription_id').primary();
            table.string('subscriber_id').notNullable();
            table.string('channel_id').notNullable();
            table.string('status').notNullable();
            table.timestamp('subscribed_at', { useTz: true }).nullable();
            table.timestamp('un_subscribed_at', { useTz: true }).nullable();
        });
        await pg.raw("ALTER SEQUENCE subscription_subscription_id_seq RESTART WITH 1");
    }
}

export async function all(): Promise<Subscription[] | undefined> {
    return pg('subscription').select(allFields);
}

export async function getById(subscriptionId: string): Promise<Subscription | undefined> {
    return pg('subscription').select(allFields).where('subscription_id', '=', subscriptionId).first();
}

export async function getByChannelId(channelId: string): Promise<Subscription[] | undefined> {
    return pg('subscription').select(allFields).where('channel_id', '=', channelId);
}

export async function getPendingByChannelId(channelId: string): Promise<Subscription[] | undefined> {
    return pg('subscription').select(allFields).where('channel_id', '=', channelId).andWhere('status', '=', 'pending');
}

export async function getSubscribedByChannelId(channelId: string): Promise<Subscription[] | undefined> {
    return pg('subscription').select(allFields).where('channel_id', '=', channelId).andWhere('status', '=', 'subscribed');
}

export async function getBySubscriberId(subscriberId: string): Promise<Subscription[] | undefined> {
    return pg('subscription').select(allFields).where('subscriber_id', '=', subscriberId);
}

export async function getPendingBySubscriberId(subscriberId: string): Promise<Subscription[] | undefined> {
    return pg('subscription').select(allFields).where('subscriber_id', '=', subscriberId).andWhere('status', '=', 'pending');
}

export async function getSubscribedBySubscriberId(subscriberId: string): Promise<Subscription[] | undefined> {
    return pg('subscription').select(allFields).where('subscriber_id', '=', subscriberId).andWhere('status', '=', 'subscribed');
}

export async function getBySubscriberIdAndChannelId(subscriberId: string, channelId: string): Promise<Subscription | undefined> {
    return pg('subscription').select(allFields).where('subscriber_id', '=', subscriberId).andWhere('channel_id', '=', channelId).first();
}

export async function insert(subscription: Subscription): Promise<Subscription> {
    const subscriptionId = await pg('subscription').insert({
        subscriber_id: subscription.subscriberId,
        channel_id: subscription.channelId,
        status: subscription.status,
        subscribed_at: subscription.subscribedAt ? toDate(subscription.subscribedAt) : null,
        un_subscribed_at: subscription.unSubscribedAt ? toDate(subscription.unSubscribedAt) : null,
    }).returning('subscription_id');
    return { ...subscription, subscriptionId: subscriptionId[0] };
}

export async function update(subscription: Subscription): Promise<void> {
    const query = pg('subscription').insert({
        subscription_id: subscription.subscriptionId,
        subscriber_id: subscription.subscriberId,
        channel_id: subscription.channelId,
        status: subscription.status,
        subscribed_at: subscription.subscribedAt ? toDate(subscription.subscribedAt) : null,
        un_subscribed_at: subscription.unSubscribedAt ? toDate(subscription.unSubscribedAt) : null,
    }).onConflict('subscription_id').merge().returning('*');
    return (await query).pop();
}

export async function main(): Promise<void> {
    await create();
}



