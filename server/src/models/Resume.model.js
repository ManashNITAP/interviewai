import mongoose from 'mongoose';

const sectionSchema = new mongoose.Schema({
  education: { score: Number, feedback: String },
  experience: { score: Number, feedback: String },
  skills: { score: Number, feedback: String },
  projects: { score: Number, feedback: String },
}, { _id: false });

const resumeSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  fileName: { type: String, required: true },
  fileUrl: { type: String, required: true },
  publicId: { type: String, required: true },
  rawText: { type: String, select: false },
  atsScore: { type: Number, min: 0, max: 100 },
  strengths: [String],
  weaknesses: [String],
  missingKeywords: [String],
  sectionAnalysis: sectionSchema,
  suggestions: [String],
  promptVersion: { type: String },
  analyzedAt: Date,
}, { timestamps: true });

resumeSchema.index({ userId: 1, createdAt: -1 });
export const Resume = mongoose.model('Resume', resumeSchema);
