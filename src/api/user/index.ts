import express from 'express';
import * as controller from './controller';

const router = express.Router();

router.get('/', controller.all);
router.get('/email/:userEmail', controller.getByEmail);
router.get('/userId/:userId', controller.getByAccountId);
router.put('/', controller.update);
router.get('/remove/:userEmail', controller.remove);
router.put('/updateProfileImg', controller.updateProfileImg);
router.put('/updateProfile', controller.updateProfile);
router.get('/getProfileUrlbyAccountId/:userId', controller.getProfileUrlbyAccountId);

export default router;
