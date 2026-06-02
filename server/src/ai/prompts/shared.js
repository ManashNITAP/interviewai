export const JSON_GUARD =
  'Respond with ONLY a single valid JSON object. No markdown, no code fences, no text before or after.';

export const buildCorrectionPrompt = (originalPrompt, badOutput, errorMsg) => `
${originalPrompt}

Your previous response was INVALID. ${JSON_GUARD}

Previous (invalid) response:
${badOutput.slice(0, 2000)}

Fix these validation errors:
${errorMsg}

Return the corrected JSON now.`.trim();
