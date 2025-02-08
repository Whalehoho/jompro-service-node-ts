import e from 'express';
import type { Controller } from '~/api';
import { RSVP } from '~/database/data';

export type GetByEventId = Controller<{ data: RSVP[] | undefined }, { eventId: string }>;
export type GetByEventIdAndAccountId = Controller<{ data: RSVP | undefined }, { eventId: string, accountId: string }>;
export type GetApprovedByEventId = Controller<{ data: RSVP[] | undefined }, { eventId: string }>;
export type GetApprovedByAccountId = Controller<{ data: RSVP[] | undefined }, { accountId: string }>;
export type GetPendingByEventId = Controller<{ data: RSVP[] | undefined }, { eventId: string }>;
export type Create = Controller<{ data: RSVP }, never, RSVP>;
export type Update = Controller<{ data: RSVP }, never, RSVP>;
export type Approve = Controller<{ data: string }, { rsvpId: string }>;
export type Delete = Controller<{ data: string }, { rsvpId: string }>;