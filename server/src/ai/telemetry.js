import { logger } from '../utils/logger.js';
import { env } from '../config/env.js';

// NOTE: Pricing is ILLUSTRATIVE and changes - verify current rates for your
// model/region before relying on these numbers. USD per 1M tokens.
const PRICING = {
  'gemini-2.5-flash': { input: 0.075, output: 0.30 },
};

const estimateCost = (model, usage) => {
  const p = PRICING[model];
  if (!p) return null;
  return (usage.promptTokens / 1e6) * p.input
       + (usage.completionTokens / 1e6) * p.output;
};

export const recordUsage = ({ task, usage, latencyMs, attempt }) => {
  const cost = estimateCost(env.GEMINI_MODEL, usage);
  logger.info(
    `[AI:${task}] attempt=${attempt} tokens=${usage.totalTokens} ` +
    `(in ${usage.promptTokens}/out ${usage.completionTokens}) ` +
    `latency=${latencyMs}ms${cost != null ? ` ~$${cost.toFixed(5)}` : ''}`,
  );
};
