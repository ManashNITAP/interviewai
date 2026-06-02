import { Router } from 'express';
import * as ctrl from '../controllers/resume.controller.js';
import { verifyJWT } from '../middleware/auth.middleware.js';
import { uploadResume } from '../middleware/upload.middleware.js';
import { aiLimiter } from '../middleware/rateLimit.middleware.js';

const router = Router();
router.use(verifyJWT);
router.post('/analyze', aiLimiter, uploadResume, ctrl.uploadAndAnalyze);
router.get('/', ctrl.listResumes);
router.get('/:id', ctrl.getResume);
router.delete('/:id', ctrl.deleteResume);
export default router;
