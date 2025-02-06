import express from 'express';

import * as middleware from './middleware';
import userRouter from '@/api/user';
import authRouter from '@/api/auth';
import regionRouter from '@/api/region';
import channelRouter from '@/api/channel';
import subscriptionRouter from '@/api/subscription';
import eventRouter from '@/api/event';
import rsvpRouter from '@/api/rsvp';


const router = express.Router();

router.get('/', (_, response) => response.status(200).send('ok'));
router.get('/health', (_, response) => response.status(200).send('ok'));

router.use(middleware.logRequest);
router.use('/auth', authRouter);
router.use(middleware.verifyToken);
router.use('/user', userRouter);
router.use('/region', regionRouter);
router.use('/channel', channelRouter);
router.use('/subscription', subscriptionRouter);
router.use('/event', eventRouter);
router.use('/rsvp', rsvpRouter);

export default router;
