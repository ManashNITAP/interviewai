export const ATS_RUBRIC = `
Score the resume 0-100 using this calibrated rubric:
- 90-100: ATS-optimized; strong action verbs, quantified impact, keyword-rich, clean parseable structure.
- 75-89:  Solid; minor keyword or formatting gaps.
- 60-74:  Average; missing quantification, weak verbs, or thin sections.
- 40-59:  Below average; vague, generic, poor keyword coverage.
- 0-39:   Poor; major gaps, unparseable layout, or near-empty sections.
Penalize: tables/images that break ATS parsing, missing contact info, no measurable results.
Do NOT inflate. A typical resume scores 55-70.`.trim();

export const DIMENSION_RUBRIC = `
Score each dimension 0-10:
- technicalQuality: correctness, depth, and relevance of technical content.
- communication:    clarity, concision, precise terminology.
- confidence:       decisiveness and ownership in phrasing (not arrogance).
- structure:        logical flow; for behavioral answers, expect STAR (Situation, Task, Action, Result).
Reserve 9-10 for answers a strong senior candidate would give. Be calibrated, not generous.
A vague or partially-correct answer should land 3-6.`.trim();
