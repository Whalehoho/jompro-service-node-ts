import express from 'express';
import * as controller from './controller';
import exp from 'constants';

const router = express.Router();

// Subscription
router.get('/getMySubscribed/:subscriberId', controller.getSubscribedBySubscriberId);
router.get('/getSubscribedByChannelId/:channelId', controller.getSubscribedByChannelId);

export default router;