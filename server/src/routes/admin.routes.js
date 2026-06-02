import { Router } from 'express';
import { verifyJWT } from '../middleware/auth.middleware.js';
import { requireRole } from '../middleware/role.middleware.js';
import * as ctrl from '../controllers/admin.controller.js';

const router = Router();
router.use(verifyJWT, requireRole('admin'));
router.get('/users', ctrl.listUsers);
router.delete('/users/:id', ctrl.deleteUser);
router.get('/resumes', ctrl.adminListResumes);
router.get('/interviews', ctrl.adminListInterviews);
router.get('/analytics', ctrl.platformAnalytics);
export default router;
