import type * as API from '~/api/region';

import logger from 'logger';
import { success, failure } from '@/api/util';
import * as db from '@/services/database';
import { Region } from '~/database/data';

const log = logger('API', 'PROD');

export const all: API.All = async function (request, response) {
    try {
        const data = await db.region.all();
        success(response, { data });
    } catch (e) {
        log.error(e);
        failure(response, e.message);
    }
};

export const getByAccountId: API.GetByAccountId = async function (request, response) {
    const { accountId } = request.params;
    try {
        const data = await db.region.getByAccountId(accountId);
        success(response, { data });
    } catch (e) {
        log.error(e);
        failure(response, e.message);
    }
}

export const update: API.Update = async function (request, response) {
    const region = request.body;
    console.log('Update Region', region);
    try {
        const data = await db.region.update(region);
        success(response, { data: 'success' });
    } catch (e) {
        log.error(e);
        failure(response, e.message);
    }
};

export const remove: API.Remove = async function (request, response) {
    const { accountId } = request.params;
    try {
        await db.region.remove(accountId);
        success(response, { data: 'success' });
    } catch (e) {
        log.error(e);
        failure(response, e.message);
    }
}

export const updateDefault: API.updateDefault = async function (request, response) {
    const region = request.body;
    console.log('Update Default Region', region);
    try {
        const data = await db.region.updateDefault(region);
        success(response, { data: 'success' });
    } catch (e) {
        log.error(e);
        failure(response, e.message);
    }
};

export const addAddress: API.addAddress = async function (request, response) {
    const { accountId } = request.params;
    const addressData = request.body as unknown as { 
        fullAddress: string; 
        city: string; 
        region: string; 
        lat: number; 
        lng: number 
    };
    console.log('account id', accountId);
    console.log('Address', request.body);
    try {
        const result = await db.region.addAddress(accountId, addressData);
        success(response, { data: result });
    } catch (e) {
        log.error(e);
        failure(response, e.message);
    }
};

export const removeAddress: API.removeAddress = async function (request, response) {
    const { accountId } = request.params;
    const addressData = request.body as unknown as {
        fullAddress: string;
        city: string;
        region: string;
        lat: number;
        lng: number;
    };
    console.log('Remove Address', addressData);
    try {
        await db.region.removeAddress(accountId, addressData);
        success(response, { data: 'success' });
    } catch (e) {
        log.error(e);
        failure(response, e.message);
    }
};