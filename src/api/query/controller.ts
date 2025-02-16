import type * as API from '~/api/query';

import logger from 'logger';
import { success, failure } from '@/api/util';
import * as db from '@/services/database';
import { Event, Channel } from '~/database/data';
import { now } from '@/util';

const log = logger('API', 'PROD');

export const searchEventsAndChannels: API.SearchEventsAndChannels = async function (request, response) {
    try {
        const { query } = request.params;
        const events = await db.event.search(query);
        const channels = await db.channel.search(query);
        success(response, { data: { events, channels } });
    } catch (e) {
        log.error(e);
        failure(response, e.message);
    }
}