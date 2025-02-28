import express from 'express';
import * as controller from './controller';

const router = express.Router();

router.post('/login', controller.login);
router.post('/register', controller.create);
router.post('/request-password-reset', controller.requestPasswordReset);
router.post('/verify-password-reset-code', controller.verifyPasswordResetCode);
router.post('/reset-password', controller.resetPassword);

export default router;
