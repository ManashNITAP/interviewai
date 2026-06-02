import { Router } from 'express';
import auth from './auth.routes.js';
import user from './user.routes.js';
import resume from './resume.routes.js';
import interview from './interview.routes.js';
import analytics from './analytics.routes.js';
import admin from './admin.routes.js';

const router = Router();
router.get('/health', (req, res) => res.json({ status: 'ok', ts: new Date().toISOString() }));
router.use('/auth', auth);
router.use('/users', user);
router.use('/resumes', resume);
router.use('/interviews', interview);
router.use('/analytics', analytics);
router.use('/admin', admin);
export default router;
