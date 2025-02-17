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
    const { userEmail } = request.params;
    try {
        const data = await db.user.getByEmail(userEmail);
        success(response, { data });
    } catch (e) {
        log.error(e);
        failure(response, e.message);
    }
};

export const getByAccountId: API.GetByAccountId = async function (request, response) {
    const { userId } = request.params;
    try {
        const data = await db.user.getByAccountId(userId);
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
    const { userEmail } = request.params;
    try {
        await db.user.remove(userEmail);
        success(response, { data: 'success' });
    } catch (e) {
        log.error(e);
        failure(response, e.message);
    }
}

export const getProfileUrlbyAccountId: API.GetProfileUrlbyAccountId = async function (request, response) {
    const { userId } = request.params;
    try {
        const data = await db.user.getProfileUrlbyAccountId(userId);
        success(response, { data });
    } catch (e) {
        log.error(e);
        failure(response, e.message);
    }
}

export const updateProfileImg: API.UpdateProfileImg = async function (request, response) {
    const { 
        userEmail, 
        userProfileImgUrl, 
        userProfileImgDeleteUrl 
    } = request.body as unknown as { 
        userEmail: string, 
        userProfileImgUrl: string, 
        userProfileImgDeleteUrl: string 
    };
    try {
        const user = await db.user.getByEmail(userEmail);
        if (!user) {
            throw new Error('User not found');
        }
        user.userProfileImgUrl = userProfileImgUrl;
        user.userProfileImgDeleteUrl = userProfileImgDeleteUrl;
        const data = await db.user.update(user);
        success(response, { data: 'success' });
    } catch (e) {
        log.error(e);
        failure(response, e.message);
    }
}

export const updateProfile: API.UpdateProfile = async function (request, response) {
    const { 
        userId, 
        userName, 
        userEmail, 
        oldPassword, 
        newPassword, 
        userAge, 
        userGender 
    } = request.body as unknown as { 
        userId: string, 
        userName: string, 
        userEmail: string, 
        oldPassword: string, 
        newPassword: string, 
        userAge: number, 
        userGender: string 
    };
    try{
        const user = await db.user.getByAccountId(userId);
        if (!user) {
            success(response, { data: 'User not found'});
            return;
        }
        if (!(await comparePassword(oldPassword, user.userPasswordHash))) {
            console.log('wrong password');
            success(response, { data: 'invalid password'});
            return;
        }
        user.userName = userName;
        user.userEmail = userEmail;
        user.userPasswordHash = newPassword === undefined? user.userPasswordHash : await hashPassword(newPassword);
        user.userAge = userAge;
        user.userGender = userGender;
        const data = await db.user.update(user);
        success(response, { data: 'success' });
    } catch (e) {
        log.error(e);
        failure(response, e.message);
    }
}