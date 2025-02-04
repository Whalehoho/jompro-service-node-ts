import express from 'express';
import * as controller from './controller';
import exp from 'constants';

const router = express.Router();

// Event
router.post('/createEvent', controller.createEvent);
router.get('/getActiveEvents/:accountId', controller.getActiveEvents);

export default router;