import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { User } from '../models/User.model.js';

export const updateProfile = asyncHandler(async (req, res) => {
  const { name, avatar } = req.body;
  const user = await User.findByIdAndUpdate(
    req.user._id,
    { ...(name && { name }), ...(avatar !== undefined && { avatar }) },
    { new: true, runValidators: true },
  );
  res.json(new ApiResponse(200, { user }, 'Profile updated'));
});
