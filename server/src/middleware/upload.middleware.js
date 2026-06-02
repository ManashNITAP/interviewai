import multer from 'multer';
import { ApiError } from '../utils/ApiError.js';

export const uploadResume = multer({
  storage: multer.memoryStorage(),
  fileFilter: (req, file, cb) =>
    file.mimetype === 'application/pdf'
      ? cb(null, true)
      : cb(new ApiError(400, 'Only PDF files are allowed'), false),
  limits: { fileSize: 5 * 1024 * 1024 },
}).single('resume');
