import { ApiError } from '../utils/ApiError.js';

export const validate = (schema) => (req, res, next) => {
  const r = schema.safeParse({ body: req.body, query: req.query, params: req.params });
  if (!r.success) {
    const errors = r.error.errors.map((e) => ({ path: e.path.join('.'), message: e.message }));
    return next(new ApiError(400, 'Validation failed', errors));
  }
  next();
};
