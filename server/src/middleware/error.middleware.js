import { ApiError } from '../utils/ApiError.js';
import { logger } from '../utils/logger.js';
import { env } from '../config/env.js';

export const notFound = (req, res, next) =>
  next(new ApiError(404, `Route not found: ${req.originalUrl}`));

export const errorHandler = (err, req, res, _next) => {
  let error = err;
  if (!(error instanceof ApiError)) {
    const code = error.statusCode || (error.name === 'ValidationError' ? 400 : 500);
    error = new ApiError(code, error.message || 'Internal Server Error', error.errors || [], err.stack);
  }
  logger.error(`${req.method} ${req.path} -> ${error.statusCode}: ${error.message}`);
  res.status(error.statusCode).json({
    success: false,
    message: error.message,
    errors: error.errors,
    ...(env.NODE_ENV !== 'production' && { stack: error.stack }),
  });
};
