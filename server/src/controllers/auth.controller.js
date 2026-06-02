import crypto from 'crypto';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import {
  signAccessToken, signRefreshToken, verifyRefreshToken,
  signSocketTicket, cookieOptions,
} from '../utils/tokens.js';
import { User } from '../models/User.model.js';
import { sendEmail } from '../services/email.service.js';
import { env } from '../config/env.js';

const issueTokens = async (user, res) => {
  const access = signAccessToken({ id: user._id, role: user.role });
  const refresh = signRefreshToken({ id: user._id });
  user.refreshToken = refresh;
  await user.save({ validateBeforeSave: false });
  res.cookie('accessToken', access, { ...cookieOptions, maxAge: 15 * 60000 });
  res.cookie('refreshToken', refresh, cookieOptions);
};

export const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  if (await User.findOne({ email })) throw new ApiError(409, 'Email already registered');
  const user = await User.create({ name, email, password });
  await issueTokens(user, res);
  res.status(201).json(new ApiResponse(201, { user }, 'Registered successfully'));
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await user.comparePassword(password))) {
    throw new ApiError(401, 'Invalid credentials');
  }
  user.lastLogin = new Date();
  await issueTokens(user, res);
  res.json(new ApiResponse(200, { user }, 'Logged in'));
});

export const logout = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(req.user._id, { $unset: { refreshToken: 1 } });
  res.clearCookie('accessToken', cookieOptions);
  res.clearCookie('refreshToken', cookieOptions);
  res.json(new ApiResponse(200, null, 'Logged out'));
});

export const refresh = asyncHandler(async (req, res) => {
  const token = req.cookies?.refreshToken;
  if (!token) throw new ApiError(401, 'Refresh token missing');
  let decoded;
  try { decoded = verifyRefreshToken(token); }
  catch { throw new ApiError(401, 'Refresh token invalid or expired'); }
  const user = await User.findById(decoded.id).select('+refreshToken');
  if (!user || user.refreshToken !== token) throw new ApiError(401, 'Refresh token revoked');
  await issueTokens(user, res);
  res.json(new ApiResponse(200, null, 'Token refreshed'));
});

export const forgotPassword = asyncHandler(async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  const generic = new ApiResponse(200, null, 'If the email exists, a reset link was sent');
  if (!user) return res.json(generic);

  const raw = crypto.randomBytes(32).toString('hex');
  const hash = crypto.createHash('sha256').update(raw).digest('hex');
  user.resetPasswordToken = hash;
  user.resetPasswordExpires = Date.now() + 15 * 60000;
  await user.save({ validateBeforeSave: false });

  const link = `${env.CLIENT_URL}/reset-password?token=${raw}`;
  await sendEmail({
    to: user.email,
    subject: 'Reset your InterviewAI password',
    html: `<p>Click <a href="${link}">here</a> to reset your password. Expires in 15 minutes.</p>`,
  });
  res.json(generic);
});

export const resetPassword = asyncHandler(async (req, res) => {
  const { token, password } = req.body;
  const hash = crypto.createHash('sha256').update(token).digest('hex');
  const user = await User.findOne({
    resetPasswordToken: hash,
    resetPasswordExpires: { $gt: Date.now() },
  });
  if (!user) throw new ApiError(400, 'Invalid or expired reset token');
  user.password = password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;
  await user.save();
  res.json(new ApiResponse(200, null, 'Password reset successful'));
});

export const me = asyncHandler(async (req, res) =>
  res.json(new ApiResponse(200, { user: req.user })));

export const socketTicket = asyncHandler(async (req, res) => {
  const ticket = signSocketTicket({ id: req.user._id, role: req.user.role });
  res.json(new ApiResponse(200, { ticket }));
});
