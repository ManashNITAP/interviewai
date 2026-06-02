import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { Resume } from '../models/Resume.model.js';
import { Interview } from '../models/Interview.model.js';

export const userAnalytics = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const [resumes, interviews] = await Promise.all([
    Resume.find({ userId }).select('atsScore createdAt').sort({ createdAt: 1 }),
    Interview.find({ userId, status: 'completed' })
      .select('overallScore role createdAt questions.evaluation').sort({ createdAt: 1 }),
  ]);

  const resumeTrend = resumes.map((r) => ({ date: r.createdAt, score: r.atsScore }));
  const interviewTrend = interviews.map((i) => ({ date: i.createdAt, score: i.overallScore }));
  const avgInterviewScore = interviews.length
    ? interviews.reduce((s, i) => s + (i.overallScore || 0), 0) / interviews.length
    : 0;

  const dims = ['technicalQuality', 'communication', 'confidence', 'structure'];
  const acc = Object.fromEntries(dims.map((d) => [d, { sum: 0, n: 0 }]));
  for (const i of interviews) for (const q of i.questions) {
    if (!q.evaluation) continue;
    for (const d of dims) if (typeof q.evaluation[d] === 'number') {
      acc[d].sum += q.evaluation[d]; acc[d].n += 1;
    }
  }
  const weakAreas = dims
    .map((d) => ({ dimension: d, avg: acc[d].n ? acc[d].sum / acc[d].n : null }))
    .filter((x) => x.avg !== null).sort((a, b) => a.avg - b.avg);

  res.json(new ApiResponse(200, {
    counts: { resumes: resumes.length, interviews: interviews.length },
    avgInterviewScore, resumeTrend, interviewTrend, weakAreas,
  }));
});
