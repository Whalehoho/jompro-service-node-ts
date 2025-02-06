import e from 'express';
import type { Controller } from '~/api';
import { RSVP } from '~/database/data';

export type GetByEventId = Controller<{ data: RSVP[] | undefined }, { eventId: string }>;