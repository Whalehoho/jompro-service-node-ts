import type { Request, Response, NextFunction } from 'express';

import * as fs from 'fs';
import dayjs from 'dayjs';
import logger from 'logger';
import cron from 'node-schedule';
import { failure } from '@/api/util';
import jwt from 'jsonwebtoken';
import { SECRET_KEY } from '@/util';

const log = logger('API', 'AUTH');
log.setLogLevel(process.env.LOG_REQUEST === 'true' ? 'debug' : 'info');

const PATH = './logs/api';
if (!fs.existsSync(PATH)) fs.mkdirSync(PATH, { recursive: true });

// Daily removal of files > 30d old
cron.scheduleJob('0 0 * * *', function (fireDate) {
    try {
        const cutoff = dayjs(fireDate).subtract(30, 'day');

        for (const f of fs.readdirSync(PATH + '/'))
            if (dayjs(f.split('.')[0]).isBefore(cutoff)) fs.unlinkSync(PATH + '/' + f);
    } catch (e) {
        log.error(e);
    }
});

export function logRequest(request: Request, response: Response, next: NextFunction): void {
    const date = dayjs();
    const { method, path, ip, params, query, body } = request;
    log.debug(`Incoming request ${method} ${path} from ${ip}`);

    fs.createWriteStream(`${PATH}/${date.format('YYYY-MM-DD')}.jsonl`, { flags: 'a' }).write(
        `${JSON.stringify({
            time: date.format('YYYY-MM-DD HH:mm:ss'),
            method,
            path,
            ip,
            params,
            query,
            body,
        })}\n`
    );
    next();
}

export function verifyToken(request: Request, response: Response, next: NextFunction): Response<any> | void {
    const token = request.headers['authorization'];

    if (!token) {
        log.warn('No token provided');
        return response.status(401).json({ message: 'Token is required' });
    }

    try {
        const decoded = jwt.verify(token.split(' ')[1], SECRET_KEY);  // Split 'Bearer token'
        request.user = decoded;  // Attach decoded user information to the request object
        next();  // Proceed to the next middleware/route handler
    } catch (error) {
        log.error('Invalid token', error);
        return response.status(401).json({ message: 'Invalid or expired token' });
    }
}

