import e from 'express';
import type { Controller } from '~/api';
import { Event } from '~/database/data';

// Event
export type CreateEvent = Controller<{ data: Event }, never, Event>;
export type UpdateEvent = Controller<{ data: Event }, never, Event>;
export type GetActiveEvents = Controller<{ data: Event[] | undefined }, {accountId: string}>; 
export type GetByCity = Controller<{ data: Event[] | undefined }, { city: string }>;
export type GetByOrganizerId = Controller<{ data: Event[] | undefined }, { organizerId: string }>;