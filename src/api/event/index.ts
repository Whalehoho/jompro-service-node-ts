import express from 'express';
import * as controller from './controller';
import exp from 'constants';
import * as recommender from '../../services/event_recommender';

const router = express.Router();

// Event
router.post('/createEvent', controller.createEvent);
router.post('/updateEvent', controller.updateEvent);
router.get('/getByAccountId/:userId', controller.getByAccountId);
router.get('/getActiveEvents/:userId', controller.getActiveEvents);
router.get('/getActiveByEventId/:eventId', controller.getActiveByEventId);
router.get('/getById/:eventId', controller.getById);
router.get('/getActiveEventsByChannelId/:channelId', controller.getActiveEventsByChannelId);
router.get('/getActiveEventsByOrganizerId/:organizerId', controller.getActiveEventsByOrganizerId);
router.post('/add-event', recommender.addEvent);
router.post('/getEventRecommendations', recommender.getRecommendations);

export default router;