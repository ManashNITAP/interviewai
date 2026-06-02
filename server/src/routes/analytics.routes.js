import { Router } from 'express';
import { verifyJWT } from '../middleware/auth.middleware.js';
import { userAnalytics } from '../controllers/analytics.controller.js';

const router = Router();
router.get('/me', verifyJWT, userAnalytics);
export default router;
