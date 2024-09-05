import express from 'express';
import * as controller from './controller';

const router = express.Router();

router.get('/', controller.all);
router.get('/accountId/:accountId', controller.getByAccountId);
router.put('/', controller.update);
router.get('/remove/:accountId', controller.remove);
router.put('/updateDefault', controller.updateDefault);
router.put('/addAddress/:accountId', controller.addAddress);
router.put('/removeAddress/:accountId', controller.removeAddress);


export default router;