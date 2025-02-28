import type * as API from '~/api/auth';

import logger from 'logger';
import { success, failure } from '@/api/util';
import * as db from '@/services/database';
import { User, Footprint } from '~/database/data';
import { hashPassword, comparePassword, SECRET_KEY } from '@/util';
import jwt from 'jsonwebtoken';
import { now } from '@/util';
import { sendVerificationEmail, verifyCode } from '@/services/mail_sender';

const log = logger('API', 'PROD');

export const create: API.Create = async function (request, response) {
    const user = request.body;
    console.log('Create User', user);
    try {
        const userPasswordHash = await hashPassword(user.password);
        const userData = {
            userEmail: user.userEmail,
            userName: user.userName,
            userPasswordHash: userPasswordHash
        } as User;
        const data = await db.user.insert(userData);

        success(response, { data: data });

        // Logging
        if(data === 'signup successful') {
            const fetchedUser = await db.user.getByEmail(user.userEmail);
            if(!fetchedUser || !fetchedUser.userId) {
                return;
            }
            await db.footprint.insert({
                userId: fetchedUser?.userId,
                loggedAt: now(),
                action: 'signup'
            });
        }
    } catch (e) {
        log.error(e);
        failure(response, e.message);
    }
}

export const login: API.Login = async function (request, response) {
    const user: { userEmail: string, password: string } | undefined = request.body as { userEmail: string, password: string } | undefined;
    // console.log('Login User', user);
    try {
        if (!user) {
            return;
        }
        const data = await db.user.getByEmail(user.userEmail);
        // console.log('data', data);
        if (!data) {
            console.log('no user found');
            success(response, { data: 'invalid email'});
            return;
        }
        if (await comparePassword(user.password, data.userPasswordHash)) {
            console.log('success');
            const token = jwt.sign(
                // UserId is used to verify if the sensitive data accessed by user is his own data, but this project does not have such data so it is not used.
                { userId: data.userId, userEmail: data.userEmail },  // Payload
                SECRET_KEY,  // Secret key
                { expiresIn: '7h' }  // Token expiration time 
            );
            success(response, 
                    { 
                        data: 'success', 
                        token, 
                        user: {
                            userId: data.userId,
                            userEmail: data.userEmail,
                            userName: data.userName,
                            userProfileImgUrl: data.userProfileImgUrl,
                            userProfileImgDeleteUrl: data.userProfileImgDeleteUrl,
                            verified: data.verified,
                            userAge: data.userAge,
                            userGender: data.userGender,
                        } 
            });
            // Logging
            if(!data || !data.userId){
                return;
            }
            await db.footprint.insert({
                userId: data.userId,
                loggedAt: now(),
                action: 'login'
            });

        } else {
            console.log('wrong password');
            success(response, { data: 'invalid password'});
        }
    } catch (e) {
        log.error(e);
        failure(response, e.message);
    }
}

export const requestPasswordReset: API.RequestPasswordReset = async function (request, response) {
    const { userEmail } = request.body;
    try {
        const user = await db.user.getByEmail(userEmail);
        if (!user) {
            return success(response, { data: 'invalid email' });
        }
        const result = await sendVerificationEmail(userEmail);
        if (result.success) {
            success(response, { data: 'success' });
        } else {
            failure(response, result.message);
        }
    } catch (e) {
        log.error(e);
        failure(response, e.message);
    }
}

export const verifyPasswordResetCode: API.VerifyPasswordResetCode = async function (request, response) {
    const { email, code } = request.body;
    try {
        const result = verifyCode(email, code);
        if (result.success) {
            success(response, { data: 'success' });
        } else {
            failure(response, result.message);
        }
    } catch (e) {
        log.error(e);
        failure(response, e.message);
    }
}

export const resetPassword: API.ResetPassword = async function (request, response) {
    const { email, password } = request.body;
    try {
        const user = await db.user.getByEmail(email);
        if (!user) {
            return success(response, { data: 'invalid email' });
        }
        const userPasswordHash = await hashPassword(password);
        await db.user.update({ ...user, userPasswordHash });
        success(response, { data: 'success' });
    } catch (e) {
        log.error(e);
        failure(response, e.message);
    }
}

