import type * as API from '~/api/channel';

import logger from 'logger';
import { success, failure } from '@/api/util';
import * as db from '@/services/database';
import { Channel } from '~/database/data';
import { now } from '@/util';

const log = logger('API', 'PROD');

export const allChannel: API.AllChannel = async function (request, response) {
    try {
        const data = await db.channel.all();
        success(response, { data });
    } catch (e) {
        log.error(e);
        failure(response, e.message);
    }
};

export const getByChannelId: API.GetByChannelId = async function (request, response) {
    const { channelId } = request.params;
    try {
        const data = await db.channel.getById(channelId);
        success(response, { data });
    } catch (e) {
        log.error(e);
        failure(response, e.message);
    }
}


export const getByOwnerId: API.GetByOwnerId = async function (request, response) {
    const { ownerId } = request.params;
    try {
        const data = await db.channel.getByOwnerId(ownerId);
        success(response, { data });
    } catch (e) {
        log.error(e);
        failure(response, e.message);
    }
}

export const createChannel: API.CreateChannel = async function (request, response) {
    const channel = request.body;
    try {
        const data = await db.channel.insert(channel);
        success(response, { data });
        // Logging
        if(!channel.ownerId || !data) {
            return;
        }
        await db.footprint.insert({
            userId: channel.ownerId,
            loggedAt: now(),
            action: 'create channel'
        });
    } catch (e) {
        log.error(e);
        failure(response, e.message);
    }
}

export const updateChannel: API.UpdateChannel = async function (request, response) {
    const channel = request.body;
    try {
        const data = await db.channel.update(channel);
        success(response, { data });
    } catch (e) {
        log.error(e);
        failure(response, e.message);
    }
}

