import type * as API from '~/api/subscription';

import logger from 'logger';
import { success, failure } from '@/api/util';
import * as db from '@/services/database';
import { Subscription } from '~/database/data';
import { now } from '@/util';
import exp from 'constants';

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

export const getPendingByChannelId: API.GetPendingByChannelId = async function (request, response) {
    const { channelId } = request.params;
    try {
        const data = await db.subscription.getPendingByChannelId(channelId);
        success(response, { data });
    } catch (e) {
        log.error(e);
        failure(response, e.message);
    }
}

export const getSubscribedByChannelId: API.GetSubscribedByChannelId = async function (request, response) {
    const { channelId } = request.params;
    try {
        const data = await db.subscription.getSubscribedByChannelId(channelId);
        success(response, { data });
    } catch (e) {
        log.error(e);
        failure(response, e.message);
    }
}

export const getSubscribedBySubscriberIdAndChannelId: API.GetSubscribedBySubscriberIdAndChannelId = async function (request, response) {
    const { subscriberId, channelId } = request.params;
    try {
        const data = await db.subscription.getBySubscriberIdAndChannelId(subscriberId, channelId);
        success(response, { data });
    } catch (e) {
        log.error(e);
        failure(response, e.message);
    }
}

export const createSubscription: API.CreateSubscription = async function (request, response) {
    const subscription = request.body;
    try {
        const data = await db.subscription.insert(subscription);
        success(response, { data });
    } catch (e) {
        log.error(e);
        failure(response, e.message);
    }
}

export const updateSubscription: API.UpdateSubscription = async function (request, response) {
    const subscription = request.body;
    try {
        const data = await db.subscription.update(subscription);
        success(response, { data });
    } catch (e) {
        log.error(e);
        failure(response, e.message);
    }
}

export const approveSubscription: API.ApproveSubscription = async function (request, response) {
    const { subscriptionId } = request.params;
    try {
        const data = await db.subscription.approve(subscriptionId);
        success(response, { data: subscriptionId });
    } catch (e) {
        log.error(e);
        failure(response, e.message);
    }
}

export const deleteSubscription: API.DeleteSubscription = async function (request, response) {
    const { subscriptionId } = request.params;
    try {
        const data = await db.subscription.remove(subscriptionId);
        success(response, { data: subscriptionId });
    } catch (e) {
        log.error(e);
        failure(response, e.message);
    }
}