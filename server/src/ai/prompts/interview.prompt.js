import { DIMENSION_RUBRIC } from '../rubrics.js';

export const INTERVIEW_PROMPT_VERSION = 'interview@v2';

const SYSTEM = "You are an experienced technical interviewer. Questions are realistic and role-appropriate; evaluations are calibrated, specific, and reference the candidate's actual answer.";

export const buildQuestionsPrompt = ({ role, difficulty, type, numQuestions = 8 }) => ({
  system: SYSTEM,
  prompt: `
Generate ${numQuestions} interview questions.
Role: ${role}. Difficulty: ${difficulty}. Type: ${type}.
- HR -> behavioral/situational. Technical -> role-specific knowledge & problem-solving. Mixed -> blend.
- Order warm-up -> challenging. No duplicates. No numbering inside the question text.
Return JSON: { "questions": ["<question>", ...] }`.trim(),
});

export const buildEvalPrompt = ({ role, difficulty, question, answer }) => ({
  system: SYSTEM,
  prompt: `
${DIMENSION_RUBRIC}

Role: ${role} (${difficulty}).
Question: """${question}"""
Candidate answer: """${answer}"""

Evaluate strictly per the rubric. Feedback must be specific and actionable, referencing the actual answer.
improvedAnswer: a concise model answer the candidate could realistically give.
Return JSON: { "technicalQuality", "communication", "confidence", "structure", "feedback", "improvedAnswer" }`.trim(),
});

export const buildSummaryPrompt = (interview) => ({
  system: SYSTEM,
  prompt: `
Summarize this interview performance.
Role: ${interview.role} (${interview.difficulty}, ${interview.type}).

Per-question scores:
${interview.questions.map((q, i) =>
  `Q${i + 1}: ${q.question}\n  scores: ${JSON.stringify(q.evaluation || {})}`).join('\n')}

overallScore (0-100) = weighted average of dimension scores; do not be generous.
nextSteps: 3-5 concrete, prioritized actions.
Return JSON: { "overallScore", "summary", "nextSteps" }`.trim(),
});
