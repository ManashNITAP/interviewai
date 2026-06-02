import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { Interview } from '../models/Interview.model.js';
import { Report } from '../models/Report.model.js';
import { generateQuestions, evaluateAnswer, summarizeInterview } from '../services/interview.service.js';
import { INTERVIEW_PROMPT_VERSION } from '../ai/prompts/interview.prompt.js';

export const createInterview = asyncHandler(async (req, res) => {
  const { role, difficulty, type, numQuestions = 8 } = req.body;
  const qs = await generateQuestions({ role, difficulty, type, numQuestions });
  const interview = await Interview.create({
    userId: req.user._id, role, difficulty, type,
    questions: qs.map((q) => ({ question: q })),
    promptVersion: INTERVIEW_PROMPT_VERSION,
  });
  res.status(201).json(new ApiResponse(201, { interview }, 'Interview created'));
});

export const getNextQuestion = asyncHandler(async (req, res) => {
  const interview = await Interview.findOne({ _id: req.params.id, userId: req.user._id });
  if (!interview) throw new ApiError(404, 'Interview not found');
  if (interview.currentIndex >= interview.questions.length) {
    return res.json(new ApiResponse(200, { done: true }));
  }
  const q = interview.questions[interview.currentIndex];
  res.json(new ApiResponse(200, {
    questionId: q._id, question: q.question,
    index: interview.currentIndex, total: interview.questions.length,
  }));
});

export const submitAnswer = asyncHandler(async (req, res) => {
  const { questionId, answer } = req.body;
  const interview = await Interview.findOne({ _id: req.params.id, userId: req.user._id });
  if (!interview) throw new ApiError(404, 'Interview not found');
  const q = interview.questions.id(questionId);
  if (!q) throw new ApiError(404, 'Question not found');

  const evaluation = await evaluateAnswer({
    role: interview.role,
    difficulty: interview.difficulty,
    question: q.question,
    answer,
  });
  q.answer = answer;
  q.evaluation = evaluation;
  q.answeredAt = new Date();
  const idx = interview.questions.findIndex((x) => x._id.equals(q._id));
  if (idx === interview.currentIndex) interview.currentIndex += 1;
  await interview.save();
  res.json(new ApiResponse(200, { evaluation, nextIndex: interview.currentIndex }));
});

export const regenerateEvaluation = asyncHandler(async (req, res) => {
  const interview = await Interview.findOne({ _id: req.params.id, userId: req.user._id });
  if (!interview) throw new ApiError(404, 'Interview not found');
  const q = interview.questions.id(req.params.qid);
  if (!q || !q.answer) throw new ApiError(400, 'No answer to re-evaluate');

  q.evaluation = await evaluateAnswer({
    role: interview.role,
    difficulty: interview.difficulty,
    question: q.question,
    answer: q.answer,
  });
  await interview.save();
  res.json(new ApiResponse(200, { evaluation: q.evaluation }, 'Re-evaluated'));
});

export const completeInterview = asyncHandler(async (req, res) => {
  const interview = await Interview.findOne({ _id: req.params.id, userId: req.user._id });
  if (!interview) throw new ApiError(404, 'Interview not found');

  const summary = await summarizeInterview(interview);
  interview.overallScore = summary.overallScore;
  interview.summary = summary.summary;
  interview.nextSteps = summary.nextSteps;
  interview.status = 'completed';
  interview.completedAt = new Date();
  await interview.save();

  await Report.create({
    userId: req.user._id, type: 'interview', refId: interview._id,
    score: summary.overallScore, summary: summary.summary, payload: summary,
  });

  res.json(new ApiResponse(200, { interview }, 'Interview completed'));
});

export const listInterviews = asyncHandler(async (req, res) => {
  const items = await Interview.find({ userId: req.user._id }).sort({ createdAt: -1 });
  res.json(new ApiResponse(200, { interviews: items }));
});

export const getInterview = asyncHandler(async (req, res) => {
  const interview = await Interview.findOne({ _id: req.params.id, userId: req.user._id });
  if (!interview) throw new ApiError(404, 'Interview not found');
  res.json(new ApiResponse(200, { interview }));
});
