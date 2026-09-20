import express from 'express';
import { trackVisit, getMetrics } from '../controllers/metrics.controller.js';
import { requireAuth } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.post('/visit', trackVisit);
router.get('/', requireAuth, getMetrics);

export default router;
