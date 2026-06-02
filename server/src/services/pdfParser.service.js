// Import the library file directly to avoid pdf-parse's index.js debug code,
// which can throw ENOENT on first run under ESM.
import pdf from 'pdf-parse/lib/pdf-parse.js';
import { ApiError } from '../utils/ApiError.js';

export const extractTextFromPDF = async (buffer) => {
  try {
    const data = await pdf(buffer);
    const text = (data.text || '').trim();
    if (text.length < 50) {
      throw new ApiError(400, 'Resume appears empty or scanned. Please upload a text-based PDF.');
    }
    return text.slice(0, 12000); // Cap input to fit the model comfortably
  } catch (err) {
    if (err instanceof ApiError) throw err;
    throw new ApiError(400, 'Could not parse PDF: ' + err.message);
  }
};
