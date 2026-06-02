import { ATS_RUBRIC } from '../rubrics.js';

export const RESUME_PROMPT_VERSION = 'resume@v2';

const SYSTEM = 'You are a senior technical recruiter and ATS expert. You are precise, calibrated, and never inflate scores.';

const FEW_SHOT = `
Output shape (values illustrative, do not copy):
{
  "atsScore": 72,
  "strengths": ["Quantified impact in 3 of 4 roles", "Strong action verbs"],
  "weaknesses": ["Skills list tools without proficiency", "No summary statement"],
  "missingKeywords": ["CI/CD", "REST", "unit testing"],
  "sectionAnalysis": {
    "education":  { "score": 8, "feedback": "..." },
    "experience": { "score": 7, "feedback": "..." },
    "skills":     { "score": 6, "feedback": "..." },
    "projects":   { "score": 5, "feedback": "..." }
  },
  "suggestions": ["Add a 2-line professional summary", "Quantify project outcomes"]
}`.trim();

export const buildResumePrompt = (resumeText, { targetRole } = {}) => ({
  system: SYSTEM,
  prompt: `
${ATS_RUBRIC}

${targetRole ? `Target role: ${targetRole}. Weight keyword analysis toward this role.\n` : ''}
${FEW_SHOT}

Analyze the resume below. Return JSON with exactly these keys:
atsScore, strengths, weaknesses, missingKeywords,
sectionAnalysis (education/experience/skills/projects, each {score, feedback}), suggestions.
If a section is absent from the resume, score it low and say so in feedback.

Resume:
"""
${resumeText}
"""`.trim(),
});
