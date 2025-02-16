import type { Controller } from '~/api';
import { Event, Channel } from '~/database/data';

export type SearchEventsAndChannels = Controller<{ data: { events: Event[]|undefined, channels: Channel[]|undefined } | undefined }, { query: string }>;