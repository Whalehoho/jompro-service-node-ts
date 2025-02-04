import type * as API from '~/api/auth';

import logger from 'logger';
import { success, failure } from '@/api/util';
import * as db from '@/services/database';
import { User, Footprint } from '~/database/data';
import { hashPassword, comparePassword, SECRET_KEY } from '@/util';
import jwt from 'jsonwebtoken';
import { now } from '@/util';

const log = logger('API', 'PROD');

export const create: API.Create = async function (request, response) {
    const user = request.body;
    console.log('Create User', user);
    try {
        const passwordHash = await hashPassword(user.password);
        const userData = {
            email: user.email,
            userName: user.userName,
            passwordHash: passwordHash
        } as User;
        const data = await db.user.insert(userData);

        success(response, { data: data });

        // Logging
        if(data === 'signup successful') {
            const fetchedUser = await db.user.getByEmail(user.email);
            if(!fetchedUser || !fetchedUser.accountId) {
                return;
            }
            await db.footprint.insert({
                accountId: fetchedUser?.accountId,
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
    const user: { email: string, password: string } | undefined = request.body as { email: string, password: string } | undefined;
    // console.log('Login User', user);
    try {
        if (!user) {
            return;
        }
        const data = await db.user.getByEmail(user.email);
        // console.log('data', data);
        if (!data) {
            console.log('no user found');
            success(response, { data: 'invalid email'});
            return;
        }
        if (await comparePassword(user.password, data.passwordHash)) {
            console.log('success');
            const token = jwt.sign(
                { userId: data.accountId, email: data.email },  // Payload
                SECRET_KEY,  // Secret key
                { expiresIn: '7h' }  // Token expiration time 
            );
            success(response, 
                    { 
                        data: 'success', 
                        token, 
                        user: {
                            accountId: data.accountId,
                            email: data.email,
                            userName: data.userName,
                            profileImgUrl: data.profileImgUrl,
                            profileImgDeleteUrl: data.profileImgDeleteUrl,
                            age: data.age,
                            gender: data.gender,
                        } 
            });
            // Logging
            if(!data || !data.accountId){
                return;
            }
            await db.footprint.insert({
                accountId: data.accountId,
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

