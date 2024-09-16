import express from 'express';
import * as controller from './controller';
import exp from 'constants';

const router = express.Router();

// Event
router.put('/updateEvent', controller.updateEvent);
router.get('/getByHostOrCoHostId/:accountId', controller.getByHostOrCoHostId);

// Session
router.put('/updateSession', controller.updateSession);


export default router;