import { Router } from 'express';
import { verifyJWT } from '../middleware/auth.middleware.js';
import { updateProfile } from '../controllers/user.controller.js';

const router = Router();
router.patch('/me', verifyJWT, updateProfile);
export default router;
