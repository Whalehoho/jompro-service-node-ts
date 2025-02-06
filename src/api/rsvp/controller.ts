import type * as API from '~/api/rsvp';

import logger from 'logger';
import { success, failure } from '@/api/util';
import * as db from '@/services/database';
import { RSVP } from '~/database/data';
import { now } from '@/util';

const log = logger('API', 'PROD');

export const getByEventId: API.GetByEventId = async function (request, response) {
    try {
        const { eventId } = request.params;
        const data = await db.rsvp.getByEventId(eventId);
        success(response, { data });
    } catch (e) {
        log.error(e);
        failure(response, e.message);
    }
}