import type * as API from '~/api/event';

import logger from 'logger';
import { success, failure } from '@/api/util';
import * as db from '@/services/database';
import { Event } from '~/database/data';
import { now } from '@/util';

const log = logger('API', 'PROD');

export const createEvent: API.CreateEvent = async function (request, response) {
    const event = request.body;
    try {
        const data = await db.event.insert(event);
        success(response, { data });
        // Logging
        if(!event.organizerId || !data) {
            return;
        }
        await db.footprint.insert({
            accountId: event.organizerId,
            loggedAt: now(),
            action: 'create event'
        });
    } catch (e) {
        log.error(e);
        failure(response, e.message);
    }
}

export const getActiveEvents: API.GetActiveEvents = async function (request, response) {
    try {
        const { accountId } = request.params;
        const data = await db.event.allActive(accountId);
        success(response, { data });
    } catch (e) {
        log.error(e);
        failure(response, e.message);
    }
}

export const getActiveByEventId: API.GetActiveByEventId = async function (request, response) {
    try {
        const { eventId } = request.params;
        const data = await db.event.getActiveByEventId(eventId);
        success(response, { data });
    } catch (e) {
        log.error(e);
        failure(response, e.message);
    }
}

export const getById: API.GetById = async function (request, response) {
    try {
        const { eventId } = request.params;
        const data = await db.event.getById(eventId);
        success(response, { data });
    } catch (e) {
        log.error(e);
        failure(response, e.message);
    }
}

export const getActiveEventsByChannelId: API.GetActiveEventsByChannelId = async function (request, response) {
    try {
        const { channelId } = request.params;
        const data = await db.event.getActiveByChannelId(channelId);
        success(response, { data });
    } catch (e) {
        log.error(e);
        failure(response, e.message);
    }
}

export const getActiveEventsByOrganizerId: API.GetActiveEventsByOrganizerId = async function (request, response) {
    try {
        const { organizerId } = request.params;
        const data = await db.event.getActiveByOrganizerId(organizerId);
        success(response, { data });
    } catch (e) {
        log.error(e);
        failure(response, e.message);
    }
}
