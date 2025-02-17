import type * as API from '~/api/event';

import logger from 'logger';
import { success, failure } from '@/api/util';
import * as db from '@/services/database';
import { Event } from '~/database/data';
import { now } from '@/util';
import { addEvent } from '@/services/event_recommender';
import { title } from 'process';

const log = logger('API', 'PROD');

export const createEvent: API.CreateEvent = async function (request, response) {
    const event = request.body;
    try {
        const data = await db.event.insert(event);
        success(response, { data });

        console.log('data.eventid',data);

        // Add event to event recommender
        const eventRecommenderData = {
            user_id: event.organizerId,
            event_id: data.eventId,
            title: event.eventName,
            description: event.eventAbout,
        };
        await addEvent(eventRecommenderData);

        // Logging
        if(!event.organizerId || !data) {
            return;
        }
        await db.footprint.insert({
            userId: event.organizerId,
            loggedAt: now(),
            action: 'create event'
        });
    } catch (e) {
        log.error(e);
        failure(response, e.message);
    }
}

export const getByAccountId: API.GetByAccountId = async function (request, response) {
    try {
        const { userId } = request.params;
        const data = await db.event.getByOrganizerId(userId);
        success(response, { data });
    } catch (e) {
        log.error(e);
        failure(response, e.message);
    }
}

export const getActiveEvents: API.GetActiveEvents = async function (request, response) {
    try {
        const { userId } = request.params;
        const data = await db.event.allActive(userId);
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
