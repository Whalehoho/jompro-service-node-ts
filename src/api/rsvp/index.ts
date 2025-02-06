import express from 'express';
import * as controller from './controller';
import exp from 'constants';

const router = express.Router();

// RSVP
router.get('/getByEventId/:eventId', controller.getByEventId);


export default router;