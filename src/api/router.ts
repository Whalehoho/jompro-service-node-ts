import express from 'express';

import * as middleware from './middleware';
import userRouter from '@/api/user';
import authRouter from '@/api/auth';


const router = express.Router();

router.get('/', (_, response) => response.status(200).send('ok'));
router.get('/health', (_, response) => response.status(200).send('ok'));

router.use(middleware.logRequest);
router.use('/auth', authRouter);
router.use(middleware.verifyToken);
router.use('/user', userRouter);

export default router;
