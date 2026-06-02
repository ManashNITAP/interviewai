import { ApiError } from '../utils/ApiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { verifyAccessToken } from '../utils/tokens.js';
import { User } from '../models/User.model.js';

export const verifyJWT = asyncHandler(async (req, res, next) => {
  const token = req.cookies?.accessToken
    || req.headers.authorization?.replace('Bearer ', '');
  if (!token) throw new ApiError(401, 'Unauthorized: token missing');

  let decoded;
  try { decoded = verifyAccessToken(token); }
  catch { throw new ApiError(401, 'Unauthorized: token invalid or expired'); }

  const user = await User.findById(decoded.id);
  if (!user) throw new ApiError(401, 'Unauthorized: user not found');
  req.user = user;
  next();
});
