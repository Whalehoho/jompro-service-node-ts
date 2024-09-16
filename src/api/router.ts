import express from 'express';

import * as middleware from './middleware';
import userRouter from '@/api/user';
import authRouter from '@/api/auth';
import regionRouter from '@/api/region';
import eventRouter from '@/api/event';


const router = express.Router();

router.get('/', (_, response) => response.status(200).send('ok'));
router.get('/health', (_, response) => response.status(200).send('ok'));

router.use(middleware.logRequest);
router.use('/auth', authRouter);
router.use(middleware.verifyToken);
router.use('/user', userRouter);
router.use('/region', regionRouter);
router.use('/event', eventRouter);

export default router;
