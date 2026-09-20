import { Router } from 'express';
import { submitLead, getLeads, updateLeadStatus, emptyTrash } from '../controllers/leads.controller.js';
import { requireAuth } from '../middlewares/auth.middleware.js';

const router = Router();

// Public route to submit a lead from the portfolio
router.post('/', submitLead);

// Protected routes for the CRM
router.get('/', requireAuth, getLeads);
router.patch('/:id', requireAuth, updateLeadStatus);
router.delete('/trash', requireAuth, emptyTrash);

export default router;
