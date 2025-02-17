import express from 'express';
import * as controller from './controller';

const router = express.Router();

router.get('/', controller.all);
router.get('/userId/:userId', controller.getByAccountId);
router.put('/', controller.update);
router.get('/remove/:userId', controller.remove);
router.put('/updateDefault', controller.updateDefault);
router.put('/addAddress/:userId', controller.addAddress);
router.put('/removeAddress/:userId', controller.removeAddress);


export default router;