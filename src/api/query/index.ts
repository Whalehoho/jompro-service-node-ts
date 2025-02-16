import express from 'express';
import * as controller from './controller';

const router = express.Router();

router.get('/search/:query', controller.searchEventsAndChannels);

export default router;