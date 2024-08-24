import express from 'express';
import * as controller from './controller';

const router = express.Router();

router.get('/', controller.all);
router.get('/email/:email', controller.getByEmail);
router.get('/accountId/:accountId', controller.getByAccountId);
router.put('/', controller.update);
router.get('/remove/:email', controller.remove);
router.put('/updateProfileImg', controller.updateProfileImg);
router.put('/updateProfile', controller.updateProfile);

export default router;
