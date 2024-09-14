import express from 'express';
import * as controller from './controller';
import exp from 'constants';

const router = express.Router();

// Event
router.put('/event', controller.updateEvent);

// Session
router.put('/session', controller.updateSession);


export default router;