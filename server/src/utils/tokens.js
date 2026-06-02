import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';

export const signAccessToken = (payload) =>
  jwt.sign(payload, env.JWT_ACCESS_SECRET, { expiresIn: env.JWT_ACCESS_EXPIRY });
export const signRefreshToken = (payload) =>
  jwt.sign(payload, env.JWT_REFRESH_SECRET, { expiresIn: env.JWT_REFRESH_EXPIRY });
export const verifyAccessToken = (t) => jwt.verify(t, env.JWT_ACCESS_SECRET);
export const verifyRefreshToken = (t) => jwt.verify(t, env.JWT_REFRESH_SECRET);

// Short-lived token used only for the Socket.IO handshake.
export const signSocketTicket = (payload) =>
  jwt.sign(payload, env.JWT_ACCESS_SECRET, { expiresIn: '60s' });

export const cookieOptions = {
  httpOnly: true,
  secure: env.NODE_ENV === 'production',
  sameSite: 'lax',
  maxAge: 7 * 24 * 60 * 60 * 1000,
};
