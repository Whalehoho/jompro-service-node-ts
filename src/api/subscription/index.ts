import express from 'express';
import * as controller from './controller';
import exp from 'constants';

const router = express.Router();

// Subscription
router.get('/getMySubscribed/:subscriberId', controller.getSubscribedBySubscriberId);
router.get('/getSubscribedByChannelId/:channelId', controller.getSubscribedByChannelId);
router.get('/getPendingByChannelId/:channelId', controller.getPendingByChannelId);
router.get('/getMyPending/:subscriberId', controller.getPendingBySubscriberId);
router.get('/getSubscribed/:subscriberId/:channelId', controller.getSubscribedBySubscriberIdAndChannelId);
router.post('/createSubscription', controller.createSubscription);
router.put('/updateSubscription', controller.updateSubscription);
router.put('/approveSubscription/:subscriptionId', controller.approveSubscription);
router.get('/deleteSubscription/:subscriptionId', controller.deleteSubscription);

export default router;