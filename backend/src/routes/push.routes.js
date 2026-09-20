import express from 'express';
import { subscribe, getVapidPublicKey } from '../controllers/push.controller.js';
import { requireAuth } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.get('/vapidPublicKey', requireAuth, getVapidPublicKey);
router.post('/subscribe', requireAuth, subscribe);

export default router;
