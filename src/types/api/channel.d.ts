import e from 'express';
import type { Controller } from '~/api';
import { Channel } from '~/database/data';

export type AllChannel = Controller<{ data: Channel[] | undefined }>;
export type GetByChannelId = Controller<{ data?: Channel }, { channelId: string }>;
export type GetByOwnerId = Controller<{ data: Channel[] | undefined }, { ownerId: string }>;
export type GetBySubscriberId = Controller<{ data: Channel[] | undefined }, { subscriberId: string }>;
export type CreateChannel = Controller<{ data: Channel }, never, Channel>;
export type UpdateChannel = Controller<{ data: Channel }, never, Channel>;