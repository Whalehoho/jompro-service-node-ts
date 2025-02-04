import type { Controller } from '~/api';
import { Subscription } from '~/database/data';

export type GetSubscribedBySubscriberId = Controller<{ data: Subscription[] | undefined }, { subscriberId: string }>;
export type GetPendingBySubscriberId = Controller<{ data: Subscription[] | undefined }, { subscriberId: string }>;