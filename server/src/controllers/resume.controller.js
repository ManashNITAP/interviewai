import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { Resume } from '../models/Resume.model.js';
import { Report } from '../models/Report.model.js';
import { uploadPDFBuffer, deleteAsset } from '../services/cloudinary.service.js';
import { extractTextFromPDF } from '../services/pdfParser.service.js';
import { analyzeResumeText } from '../services/resumeAnalysis.service.js';

export const uploadAndAnalyze = asyncHandler(async (req, res) => {
  if (!req.file) throw new ApiError(400, 'Resume file is required');

  const text = await extractTextFromPDF(req.file.buffer);
  const uploaded = await uploadPDFBuffer(req.file.buffer);
  const analysis = await analyzeResumeText(text);

  const resume = await Resume.create({
    userId: req.user._id,
    fileName: req.file.originalname,
    fileUrl: uploaded.secure_url,
    publicId: uploaded.public_id,
    rawText: text,
    ...analysis,
    analyzedAt: new Date(),
  });

  await Report.create({
    userId: req.user._id,
    type: 'resume',
    refId: resume._id,
    score: analysis.atsScore,
    summary: analysis.suggestions?.slice(0, 2).join(' '),
    payload: analysis,
  });

  res.status(201).json(new ApiResponse(201, { resume }, 'Resume analyzed'));
});

export const listResumes = asyncHandler(async (req, res) => {
  const resumes = await Resume.find({ userId: req.user._id })
    .select('-rawText').sort({ createdAt: -1 });
  res.json(new ApiResponse(200, { resumes }));
});

export const getResume = asyncHandler(async (req, res) => {
  const resume = await Resume.findOne({ _id: req.params.id, userId: req.user._id }).select('-rawText');
  if (!resume) throw new ApiError(404, 'Resume not found');
  res.json(new ApiResponse(200, { resume }));
});

export const deleteResume = asyncHandler(async (req, res) => {
  const resume = await Resume.findOne({ _id: req.params.id, userId: req.user._id });
  if (!resume) throw new ApiError(404, 'Resume not found');
  await deleteAsset(resume.publicId).catch(() => {});
  await resume.deleteOne();
  await Report.deleteMany({ type: 'resume', refId: resume._id });
  res.json(new ApiResponse(200, null, 'Resume deleted'));
});
