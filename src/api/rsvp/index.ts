import express from 'express';
import * as controller from './controller';
import exp from 'constants';

const router = express.Router();

// RSVP
router.get('/getByEventId/:eventId', controller.getByEventId);
router.get('/getApprovedByEventId/:eventId', controller.getApprovedByEventId);
router.get('/getApprovedByAccountId/:accountId', controller.getApprovedByAccountId);
router.get('/getPendingByEventId/:eventId', controller.getPendingByEventId);
router.get('/getByEventIdAndAccountId/:eventId/:accountId', controller.getByEventIdAndAccountId);
router.post('/create', controller.create);
router.put('/update', controller.update);
router.get('/delete/:rsvpId', controller.deleteRsvp);
router.put('/approve/:rsvpId', controller.approve);

export default router;