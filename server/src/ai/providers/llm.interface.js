/**
 * Contract every LLM provider must satisfy. Pure JSDoc - no runtime code.
 *
 * @typedef {Object} LLMUsage
 * @property {number} promptTokens
 * @property {number} completionTokens
 * @property {number} totalTokens
 *
 * @typedef {Object} LLMResult
 * @property {string} text
 * @property {LLMUsage} usage
 *
 * @typedef {Object} LLMProvider
 * @property {string} name
 * @property {(args: { prompt: string, system?: string, temperature?: number }) => Promise<LLMResult>} generate
 */
export {};
