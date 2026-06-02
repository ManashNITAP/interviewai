import rateLimit from 'express-rate-limit';

export const apiLimiter = rateLimit({ windowMs: 15 * 60000, max: 200, standardHeaders: true, legacyHeaders: false });
export const authLimiter = rateLimit({ windowMs: 15 * 60000, max: 10, skipSuccessfulRequests: true, message: 'Too many auth attempts. Try again later.' });
export const aiLimiter = rateLimit({ windowMs: 60 * 60000, max: 30, message: 'AI quota exceeded for this hour.' });
