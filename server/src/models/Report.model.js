import mongoose from 'mongoose';

const reportSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  type: { type: String, enum: ['resume', 'interview'], required: true },
  refId: { type: mongoose.Schema.Types.ObjectId, required: true },
  score: { type: Number, min: 0, max: 100 },
  summary: String,
  payload: mongoose.Schema.Types.Mixed,
}, { timestamps: true });

reportSchema.index({ userId: 1, type: 1, createdAt: -1 });
export const Report = mongoose.model('Report', reportSchema);
