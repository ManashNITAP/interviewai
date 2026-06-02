import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { User } from '../models/User.model.js';
import { Resume } from '../models/Resume.model.js';
import { Interview } from '../models/Interview.model.js';

export const listUsers = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20 } = req.query;
  const users = await User.find().sort({ createdAt: -1 })
    .skip((page - 1) * limit).limit(Number(limit));
  const total = await User.countDocuments();
  res.json(new ApiResponse(200, { users, total, page: Number(page) }));
});

export const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) throw new ApiError(404, 'User not found');
  if (user.role === 'admin') throw new ApiError(400, 'Cannot delete admin user');
  await user.deleteOne();
  await Resume.deleteMany({ userId: user._id });
  await Interview.deleteMany({ userId: user._id });
  res.json(new ApiResponse(200, null, 'User deleted'));
});

export const platformAnalytics = asyncHandler(async (req, res) => {
  const [users, resumes, interviews] = await Promise.all([
    User.countDocuments(), Resume.countDocuments(), Interview.countDocuments(),
  ]);
  const avg = await Resume.aggregate([{ $group: { _id: null, avg: { $avg: '$atsScore' } } }]);
  res.json(new ApiResponse(200, {
    counts: { users, resumes, interviews },
    avgAtsScore: avg[0]?.avg || 0,
  }));
});

export const adminListResumes = asyncHandler(async (req, res) => {
  const resumes = await Resume.find().populate('userId', 'name email')
    .sort({ createdAt: -1 }).limit(100);
  res.json(new ApiResponse(200, { resumes }));
});

export const adminListInterviews = asyncHandler(async (req, res) => {
  const items = await Interview.find().populate('userId', 'name email')
    .sort({ createdAt: -1 }).limit(100);
  res.json(new ApiResponse(200, { interviews: items }));
});
