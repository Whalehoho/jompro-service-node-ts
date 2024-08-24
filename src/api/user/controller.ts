import type * as API from '~/api/user';

import logger from 'logger';
import { success, failure } from '@/api/util';
import * as db from '@/services/database';
import { User } from '~/database/data';
import { hashPassword, comparePassword, SECRET_KEY } from '@/util';
import jwt from 'jsonwebtoken';

const log = logger('API', 'PROD');

export const all: API.All = async function (request, response) {
    try {
        const data = await db.user.all();
        success(response, { data });
    } catch (e) {
        log.error(e);
        failure(response, e.message);
    }
};

export const getByEmail: API.GetByEmail = async function (request, response) {
    const { email } = request.params;
    try {
        const data = await db.user.getByEmail(email);
        success(response, { data });
    } catch (e) {
        log.error(e);
        failure(response, e.message);
    }
};

export const getByAccountId: API.GetByAccountId = async function (request, response) {
    const { accountId } = request.params;
    try {
        const data = await db.user.getByAccountId(accountId);
        success(response, { data });
    } catch (e) {
        log.error(e);
        failure(response, e.message);
    }
}

export const update: API.Update = async function (request, response) {
    const user = request.body;
    console.log('Update User', user);
    try {
        const data = await db.user.update(user);
        success(response, { data: 'success' });
    } catch (e) {
        log.error(e);
        failure(response, e.message);
    }
};

export const remove: API.Remove = async function (request, response) {
    const { email } = request.params;
    try {
        await db.user.remove(email);
        success(response, { data: 'success' });
    } catch (e) {
        log.error(e);
        failure(response, e.message);
    }
}

export const updateProfileImg: API.UpdateProfileImg = async function (request, response) {
    const { 
        email, 
        profileImgUrl, 
        profileImgDeleteUrl 
    } = request.body as unknown as { 
        email: string, 
        profileImgUrl: string, 
        profileImgDeleteUrl: string 
    };
    try {
        const user = await db.user.getByEmail(email);
        if (!user) {
            throw new Error('User not found');
        }
        user.profileImgUrl = profileImgUrl;
        user.profileImgDeleteUrl = profileImgDeleteUrl;
        const data = await db.user.update(user);
        success(response, { data: 'success' });
    } catch (e) {
        log.error(e);
        failure(response, e.message);
    }
}

export const updateProfile: API.UpdateProfile = async function (request, response) {
    const { 
        accountId, 
        userName, 
        email, 
        oldPassword, 
        newPassword, 
        age, 
        gender 
    } = request.body as unknown as { 
        accountId: string, 
        userName: string, 
        email: string, 
        oldPassword: string, 
        newPassword: string, 
        age: number, 
        gender: string 
    };
    try{
        const user = await db.user.getByAccountId(accountId);
        if (!user) {
            success(response, { data: 'User not found'});
            return;
        }
        if (!(await comparePassword(oldPassword, user.passwordHash))) {
            console.log('wrong password');
            success(response, { data: 'invalid password'});
            return;
        }
        user.userName = userName;
        user.email = email;
        user.passwordHash = newPassword === undefined? user.passwordHash : await hashPassword(newPassword);
        user.age = age;
        user.gender = gender;
        const data = await db.user.update(user);
        success(response, { data: 'success' });
    } catch (e) {
        log.error(e);
        failure(response, e.message);
    }
}