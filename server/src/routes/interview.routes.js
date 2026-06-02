import { Router } from 'express';
import * as ctrl from '../controllers/interview.controller.js';
import { verifyJWT } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validate.middleware.js';
import { aiLimiter } from '../middleware/rateLimit.middleware.js';
import { createInterviewSchema, submitAnswerSchema } from '../validators/interview.validator.js';

const router = Router();
router.use(verifyJWT);
router.post('/', aiLimiter, validate(createInterviewSchema), ctrl.createInterview);
router.get('/', ctrl.listInterviews);
router.get('/:id', ctrl.getInterview);
router.get('/:id/next', ctrl.getNextQuestion);
router.post('/:id/answer', aiLimiter, validate(submitAnswerSchema), ctrl.submitAnswer);
router.post('/:id/questions/:qid/regenerate', aiLimiter, ctrl.regenerateEvaluation);
router.post('/:id/complete', aiLimiter, ctrl.completeInterview);
export default router;
