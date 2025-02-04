import express from 'express';
import * as controller from './controller';
import exp from 'constants';

const router = express.Router();

// Channel
router.get('/allChannel', controller.allChannel);
router.get('/getByChannelId/:channelId', controller.getByChannelId);
router.get('/getByOwnerId/:ownerId', controller.getByOwnerId);
router.post('/createChannel', controller.createChannel);
router.put('/updateChannel', controller.updateChannel);

export default router;