import { Router } from 'express';
import { login, verifySession } from '../controllers/auth.controller.js';
import { requireAuth } from '../middlewares/auth.middleware.js';

const router = Router();

router.post('/login', login);
router.get('/session', requireAuth, verifySession);

export default router;
