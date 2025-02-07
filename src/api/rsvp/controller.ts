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

export const getApprovedByEventId: API.GetApprovedByEventId = async function (request, response) {
    try {
        const { eventId } = request.params;
        const data = await db.rsvp.getApprovedByEventId(eventId);
        success(response, { data });
    } catch (e) {
        log.error(e);
        failure(response, e.message);
    }
}

export const getPendingByEventId: API.GetPendingByEventId = async function (request, response) {
    try {
        const { eventId } = request.params;
        const data = await db.rsvp.getPendingByEventId(eventId);
        success(response, { data });
    } catch (e) {
        log.error(e);
        failure(response, e.message);
    }
}

export const getByEventIdAndAccountId: API.GetByEventIdAndAccountId = async function (request, response) {
    const { eventId, accountId } = request.params;
    try {
        const data = await db.rsvp.getByEventIdAndAccountId(eventId, accountId);
        success(response, { data });
    } catch (e) {
        log.error(e);
        failure(response, e.message);
    }
}

export const create: API.Create = async function (request, response) {
    const rsvp = request.body;
    try {
        const data = await db.rsvp.insert(rsvp);
        console.log('Create RSVP', data);
        success(response, { data });
    } catch (e) {
        log.error(e);
        failure(response, e.message);
    }
}

export const update: API.Update = async function (request, response) {
    const rsvp = request.body;
    try {
        const data = await db.rsvp.update(rsvp);
        success(response, { data });
    } catch (e) {
        log.error(e);
        failure(response, e.message);
    }
}

export const deleteRsvp: API.Delete = async function (request, response) {
    const { rsvpId } = request.params;
    try {
        const data = await db.rsvp.remove(rsvpId);
        success(response, { data: 'success' });
    } catch (e) {
        log.error(e);
        failure(response, e.message);
    }
}

export const approve: API.Approve = async function (request, response) {
    const { rsvpId } = request.params;
    try {
        const data = await db.rsvp.approve(rsvpId);
        success(response, { data: rsvpId });
    } catch (e) {
        log.error(e);
        failure(response, e.message);
    }
}

