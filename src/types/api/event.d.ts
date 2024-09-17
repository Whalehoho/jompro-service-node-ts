import e from 'express';
import type { Controller } from '~/api';
import { Event, Session } from '~/database/data';

// Event
export type AllEvent = Controller<{ data: Event[] | undefined }>;
export type GetByEventId = Controller<{ data?: Event }, { eventId: string }>;
export type GetByHostId = Controller<{ data: Event[] | undefined }, { hostId: string }>;
export type getByCoHostId = Controller<{ data: Event[] | undefined }, { coHostId: string }>;
export type getByHostOrCoHostId = Controller<{ data: Event[] | undefined }, { accountId: string, status: string }>;
export type getBySubscriberId = Controller<{ data: Event[] | undefined }, { subscriberId: string }>;

export type UpdateEvent = Controller<{ data: Event }, never, Event>;


// Session
export type AllActiveSessions = Controller<{ data: Session[] | undefined }>;
export type GetSessionsByEventId = Controller<{ data: Session[] | undefined }, { eventId: string }>;
export type GetActiveSessionsByEventId = Controller<{ data: Session[] | undefined }, { eventId: string }>;
export type GetByOrganizerId = Controller<{ data: Session[] | undefined }, { organizerId: string }>;
export type GetByParticipantId = Controller<{ data: Session[] | undefined }, { participantId: string }>;
export type GetByCity = Controller<{ data: Session[] | undefined }, { city: string }>;

export type UpdateSession = Controller<{ data: string }, never, Session>;

















