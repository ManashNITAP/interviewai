import { getProvider } from './providers/index.js';
import { JSON_GUARD, buildCorrectionPrompt } from './prompts/shared.js';
import { recordUsage } from './telemetry.js';
import { env } from '../config/env.js';
import { ApiError } from '../utils/ApiError.js';
import { logger } from '../utils/logger.js';

const stripFences = (raw) => raw.replace(/```json\s*|\s*```/g, '').trim();

const extractJSON = (raw) => {
  const cleaned = stripFences(raw);
  try { return JSON.parse(cleaned); }
  catch {
    const m = cleaned.match(/\{[\s\S]*\}|\[[\s\S]*\]/);
    if (m) return JSON.parse(m[0]);
    throw new Error('No JSON found in model output');
  }
};

export const generateValidated = async ({
  task, prompt, schema, system,
  temperature = 0.7,
  maxRepairs = env.AI_MAX_REPAIRS,
}) => {
  const provider = getProvider();
  let currentPrompt = `${prompt}\n\n${JSON_GUARD}`;
  let lastError;

  for (let attempt = 0; attempt <= maxRepairs; attempt++) {
    const started = Date.now();
    const { text, usage } = await provider.generate({ prompt: currentPrompt, system, temperature });
    recordUsage({ task, usage, latencyMs: Date.now() - started, attempt });

    let parsed;
    try { parsed = extractJSON(text); }
    catch (err) {
      lastError = `Invalid JSON: ${err.message}`;
      logger.warn(`[AI:${task}] parse fail #${attempt}: ${err.message}`);
      currentPrompt = buildCorrectionPrompt(prompt, text, lastError);
      continue;
    }

    const result = schema.safeParse(parsed);
    if (result.success) return result.data;

    lastError = result.error.errors
      .map((e) => `${e.path.join('.') || '(root)'}: ${e.message}`).join('; ');
    logger.warn(`[AI:${task}] schema fail #${attempt}: ${lastError}`);
    currentPrompt = buildCorrectionPrompt(prompt, text, lastError);
  }

  throw new ApiError(502,
    `AI failed to produce valid output for "${task}" after ${maxRepairs + 1} attempts: ${lastError}`);
};
