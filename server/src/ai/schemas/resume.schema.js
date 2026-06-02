import { z } from 'zod';

const section = z.object({
  score: z.number().min(0).max(10),
  feedback: z.string().min(1),
});

export const resumeAnalysisSchema = z.object({
  atsScore: z.number().min(0).max(100),
  strengths: z.array(z.string()).min(1),
  weaknesses: z.array(z.string()),
  missingKeywords: z.array(z.string()),
  sectionAnalysis: z.object({
    education: section, experience: section, skills: section, projects: section,
  }),
  suggestions: z.array(z.string()).min(1),
});
