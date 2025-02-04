import type * as API from '~/api/event';

import logger from 'logger';
import { success, failure } from '@/api/util';
import * as db from '@/services/database';
import { Event, Session } from '~/database/data';
import c from 'config';
import { now } from '@/util';

const log = logger('API', 'PROD');

// Event
export const allEvent: API.AllEvent = async function (request, response) {
    try {
        const data = await db.event.all();
        success(response, { data });
    } catch (e) {
        log.error(e);
        failure(response, e.message);
    }
};

export const getByEventId: API.GetByEventId = async function (request, response) {
    const { eventId } = request.params;
    try {
        const data = await db.event.getById(eventId);
        success(response, { data });
    } catch (e) {
        log.error(e);
        failure(response, e.message);
    }
}

export const getByHostId: API.GetByHostId = async function (request, response) {
    const { hostId } = request.params;
    try {
        const data = await db.event.getByHostId(hostId);
        success(response, { data });
    } catch (e) {
        log.error(e);
        failure(response, e.message);
    }
}

export const getByCoHostId: API.getByCoHostId = async function (request, response) {
    const { coHostId } = request.params;
    try {
        const data = await db.event.getByCoHostId(coHostId);
        success(response, { data });
    } catch (e) {
        log.error(e);
        failure(response, e.message);
    }
}

export const getByHostOrCoHostId: API.getByHostOrCoHostId = async function (request, response) {
    const { accountId, status } = request.params;
    try {
        const data = await db.event.getByHostOrCoHostId(accountId, status);
        success(response, { data });
    } catch (e) {
        log.error(e);
        failure(response, e.message);
    }
}

export const getBySubscriberId: API.getBySubscriberId = async function (request, response) {
    const { subscriberId } = request.params;
    try {
        const data = await db.event.getBySubscriberId(subscriberId);
        success(response, { data });
    } catch (e) {
        log.error(e);
        failure(response, e.message);
    }
}

export const createEvent: API.CreateEvent = async function (request, response) {
    const eventData = request.body;
    try {
        const data = await db.event.insert(eventData);
        success(response, { data });
        // Logging
        if(!eventData.hostId){
            return;
        }
        await db.footprint.insert({
            accountId: eventData.hostId,
            loggedAt: now(),
            action: 'create event'
        });
    } catch (e) {
        log.error(e);
        failure(response, e.message);
    }
}

export const updateEvent: API.UpdateEvent = async function (request, response) {
    console.log('body', request.body);
    const eventData = request.body;
    try {
        const data = await db.event.update(eventData);
        console.log('data', data);
        success(response, { data });
    } catch (e) {
        log.error(e);
        failure(response, e.message);
    }
}

// Session
export const allActiveSessions: API.AllActiveSessions = async function (request, response) {
    try {
        const { accountId } = request.params;
        const data = await db.session.allActive(accountId);
        success(response, { data });
    } catch (e) {
        log.error(e);
        failure(response, e.message);
    }
}

export const getSessionsByEventId: API.GetSessionsByEventId = async function (request, response) {
    const { eventId } = request.params;
    try {
        const data = await db.session.getAllByEventId(eventId);
        success(response, { data });
    } catch (e) {
        log.error(e);
        failure(response, e.message);
    }
}

export const getActiveSessionsByEventId: API.GetActiveSessionsByEventId = async function (request, response) {
    const { eventId } = request.params;
    try {
        const data = await db.session.getActiveByEventId(eventId);
        success(response, { data });
    } catch (e) {
        log.error(e);
        failure(response, e.message);
    }
}

export const getByOrganizerId: API.GetByOrganizerId = async function (request, response) {
    const { organizerId } = request.params;
    try {
        const data = await db.session.getByOrganizerId(organizerId);
        success(response, { data });
    } catch (e) {
        log.error(e);
        failure(response, e.message);
    }
}

export const getByParticipantId: API.GetByParticipantId = async function (request, response) {
    const { participantId } = request.params;
    try {
        const data = await db.session.getByParticipantId(participantId);
        success(response, { data });
    } catch (e) {
        log.error(e);
        failure(response, e.message);
    }
}

export const getByCity: API.GetByCity = async function (request, response) {
    const { city } = request.params;
    try {
        const data = await db.session.getByCity(city);
        success(response, { data });
    } catch (e) {
        log.error(e);
        failure(response, e.message);
    }
}

export const createSession: API.CreateSession = async function (request, response) {
    const session = request.body;
    try {
        const data = await db.session.insert(session);
        success(response, { data: 'success' });
        // Logging
        if(!session.organizerId){
            return;
        }
        await db.footprint.insert({
            accountId: session.organizerId,
            loggedAt: now(),
            action: 'create session'
        });
    } catch (e) {
        log.error(e);
        failure(response, e.message);
    }
}

export const updateSession: API.UpdateSession = async function (request, response) {
    const session = request.body;
    console.log('session', session);
    try {
        const data = await db.session.update(session);
        console.log('data', data);
        success(response, { data: 'success' });
    } catch (e) {
        log.error(e);
        failure(response, e.message);
    }
}