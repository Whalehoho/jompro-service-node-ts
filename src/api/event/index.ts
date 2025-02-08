import express from 'express';
import * as controller from './controller';
import exp from 'constants';

const router = express.Router();

// Event
router.post('/createEvent', controller.createEvent);
router.get('/getActiveEvents/:accountId', controller.getActiveEvents);
router.get('/getActiveByEventId/:eventId', controller.getActiveByEventId);
router.get('/getById/:eventId', controller.getById);
router.get('/getActiveEventsByChannelId/:channelId', controller.getActiveEventsByChannelId);
router.get('/getActiveEventsByOrganizerId/:organizerId', controller.getActiveEventsByOrganizerId);

export default router;