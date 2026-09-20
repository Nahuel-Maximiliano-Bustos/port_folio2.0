import express from 'express';
import { getSettings, updateSetting } from '../controllers/settings.controller.js';
import { requireAuth } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.get('/', requireAuth, getSettings);
router.post('/', requireAuth, updateSetting);

export default router;
