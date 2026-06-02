import { GoogleGenerativeAI } from '@google/generative-ai';
import { env } from '../../config/env.js';

const genAI = new GoogleGenerativeAI(env.GEMINI_API_KEY);

/** @type {import('./llm.interface.js').LLMProvider} */
export const geminiProvider = {
  name: 'gemini',
  async generate({ prompt, system, temperature = 0.7 }) {
    const model = genAI.getGenerativeModel({
      model: env.GEMINI_MODEL,
      ...(system && { systemInstruction: system }),
      generationConfig: { temperature, responseMimeType: 'application/json' },
    });
    const result = await model.generateContent(prompt);
    const u = result.response.usageMetadata || {};
    return {
      text: result.response.text(),
      usage: {
        promptTokens: u.promptTokenCount || 0,
        completionTokens: u.candidatesTokenCount || 0,
        totalTokens: u.totalTokenCount || 0,
      },
    };
  },
};
