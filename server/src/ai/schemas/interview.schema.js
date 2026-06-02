import { z } from 'zod';

export const questionsSchema = z.object({
  questions: z.array(z.string().min(5)).min(1),
});

export const evaluationSchema = z.object({
  technicalQuality: z.number().min(0).max(10),
  communication: z.number().min(0).max(10),
  confidence: z.number().min(0).max(10),
  structure: z.number().min(0).max(10),
  feedback: z.string().min(1),
  improvedAnswer: z.string().min(1),
});

export const summarySchema = z.object({
  overallScore: z.number().min(0).max(100),
  summary: z.string().min(1),
  nextSteps: z.array(z.string()).min(1),
});
