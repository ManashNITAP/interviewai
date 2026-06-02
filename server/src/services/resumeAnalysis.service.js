import { generateValidated } from '../ai/runner.js';
import { buildResumePrompt, RESUME_PROMPT_VERSION } from '../ai/prompts/resume.prompt.js';
import { resumeAnalysisSchema } from '../ai/schemas/resume.schema.js';

export const analyzeResumeText = async (text, opts = {}) => {
  const { system, prompt } = buildResumePrompt(text, opts);
  const data = await generateValidated({
    task: 'resume.analyze',
    prompt, system,
    schema: resumeAnalysisSchema,
    temperature: 0.4,
  });
  return { ...data, promptVersion: RESUME_PROMPT_VERSION };
};
