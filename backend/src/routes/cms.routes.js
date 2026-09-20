import express from 'express';
import { getSections, toggleSection, getProjects, createProject, updateProject, deleteProject, getPublicContent, updateContentSection } from '../controllers/cms.controller.js';
import { requireAuth } from '../middlewares/auth.middleware.js';

const router = express.Router();

// Content
router.get('/content/public', getPublicContent); // Public readable
router.put('/content/:section_key', requireAuth, updateContentSection);

// Sections
router.get('/sections', getSections); // Public readable
router.post('/sections/toggle', requireAuth, toggleSection);

// Projects
router.get('/projects', getProjects); // Public readable
router.post('/projects', requireAuth, createProject);
router.put('/projects/:id', requireAuth, updateProject);
router.delete('/projects/:id', requireAuth, deleteProject);

export default router;
