import { geminiProvider } from './gemini.provider.js';
import { env } from '../../config/env.js';

const registry = {
  gemini: geminiProvider,
  // openai: openaiProvider,  // implement llm.interface.js, register here
  // claude: claudeProvider,
};

export const getProvider = () => {
  const p = registry[env.AI_PROVIDER];
  if (!p) throw new Error(`Unknown AI provider: ${env.AI_PROVIDER}`);
  return p;
};
