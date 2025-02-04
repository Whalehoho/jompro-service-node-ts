import type * as API from '~/api/subscription';

import logger from 'logger';
import { success, failure } from '@/api/util';
import * as db from '@/services/database';
import { Subscription } from '~/database/data';
import { now } from '@/util';

const log = logger('API', 'PROD');

export const getSubscribedBySubscriberId: API.GetSubscribedBySubscriberId = async function (request, response) {
    const { subscriberId } = request.params;
    try {
        const data = await db.subscription.getBySubscriberId(subscriberId);
        success(response, { data });
    } catch (e) {
        log.error(e);
        failure(response, e.message);
    }
}

export const getPendingBySubscriberId: API.GetPendingBySubscriberId = async function (request, response) {
    const { subscriberId } = request.params;
    try {
        const data = await db.subscription.getPendingBySubscriberId(subscriberId);
        success(response, { data });
    } catch (e) {
        log.error(e);
        failure(response, e.message);
    }
}