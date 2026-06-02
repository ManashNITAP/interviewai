import { z } from 'zod';

export const createInterviewSchema = z.object({
  body: z.object({
    role: z.enum(['Software Engineer', 'Frontend', 'Backend', 'Full Stack', 'Java Developer']),
    difficulty: z.enum(['Easy', 'Medium', 'Hard']),
    type: z.enum(['HR', 'Technical', 'Mixed']),
    numQuestions: z.number().int().min(3).max(15).optional(),
  }),
});
export const submitAnswerSchema = z.object({
  body: z.object({
    questionId: z.string().min(1),
    answer: z.string().min(1).max(5000),
  }),
});
