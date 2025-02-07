import type { Controller } from '~/api';
import { Subscription } from '~/database/data';

export type GetSubscribedBySubscriberId = Controller<{ data: Subscription[] | undefined }, { subscriberId: string }>;
export type GetPendingBySubscriberId = Controller<{ data: Subscription[] | undefined }, { subscriberId: string }>;
export type GetPendingByChannelId = Controller<{ data: Subscription[] | undefined }, { channelId: string }>;
export type GetSubscribedByChannelId = Controller<{ data: Subscription[] | undefined }, { channelId: string }>;
export type GetSubscribedBySubscriberIdAndChannelId = Controller<{ data: Subscription | undefined }, { subscriberId: string, channelId: string }>;
export type CreateSubscription = Controller<{ data: Subscription }, never, Subscription>;
export type UpdateSubscription = Controller<{ data: Subscription }, never, Subscription>;
export type DeleteSubscription = Controller<{ data: string }, { subscriptionId: string }>;
export type ApproveSubscription = Controller<{data: string}, {subscriptionId: string}>;