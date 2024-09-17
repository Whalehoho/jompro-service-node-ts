import express from 'express';
import * as controller from './controller';
import exp from 'constants';

const router = express.Router();

// Event
router.put('/updateEvent', controller.updateEvent);
router.get('/getByHostOrCoHostId/:accountId/:status', controller.getByHostOrCoHostId);
router.get('/getEventbyEventId/:eventId', controller.getByEventId);

// Session
router.put('/updateSession', controller.updateSession);
router.get('/getAllActiveSessions', controller.allActiveSessions);


export default router;