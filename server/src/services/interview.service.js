import { generateValidated } from '../ai/runner.js';
import {
  buildQuestionsPrompt, buildEvalPrompt, buildSummaryPrompt,
} from '../ai/prompts/interview.prompt.js';
import { questionsSchema, evaluationSchema, summarySchema } from '../ai/schemas/interview.schema.js';

export const generateQuestions = async (cfg) => {
  const { system, prompt } = buildQuestionsPrompt(cfg);
  const { questions } = await generateValidated({
    task: 'interview.questions', prompt, system,
    schema: questionsSchema, temperature: 0.8,
  });
  return questions;
};

export const evaluateAnswer = (cfg) => {
  const { system, prompt } = buildEvalPrompt(cfg);
  return generateValidated({
    task: 'interview.evaluate', prompt, system,
    schema: evaluationSchema, temperature: 0.3,
  });
};

export const summarizeInterview = (interview) => {
  const { system, prompt } = buildSummaryPrompt(interview);
  return generateValidated({
    task: 'interview.summary', prompt, system,
    schema: summarySchema, temperature: 0.3,
  });
};
