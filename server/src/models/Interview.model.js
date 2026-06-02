import mongoose from 'mongoose';

const qaSchema = new mongoose.Schema({
  question: { type: String, required: true },
  answer: { type: String, default: '' },
  evaluation: {
    technicalQuality: { type: Number, min: 0, max: 10 },
    communication: { type: Number, min: 0, max: 10 },
    confidence: { type: Number, min: 0, max: 10 },
    structure: { type: Number, min: 0, max: 10 },
    feedback: String,
    improvedAnswer: String,
  },
  answeredAt: Date,
});

const interviewSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  role: { type: String, enum: ['Software Engineer', 'Frontend', 'Backend', 'Full Stack', 'Java Developer'], required: true },
  difficulty: { type: String, enum: ['Easy', 'Medium', 'Hard'], required: true },
  type: { type: String, enum: ['HR', 'Technical', 'Mixed'], required: true },
  status: { type: String, enum: ['in_progress', 'completed', 'abandoned'], default: 'in_progress' },
  questions: [qaSchema],
  currentIndex: { type: Number, default: 0 },
  overallScore: { type: Number, min: 0, max: 100 },
  summary: String,
  nextSteps: [String],
  promptVersion: { type: String },
  startedAt: { type: Date, default: Date.now },
  completedAt: Date,
}, { timestamps: true });

interviewSchema.index({ userId: 1, createdAt: -1 });
export const Interview = mongoose.model('Interview', interviewSchema);
