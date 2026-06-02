import { Readable } from 'stream';
import { cloudinary } from '../config/cloudinary.js';

export const uploadPDFBuffer = (buffer, folder = 'interviewai/resumes') =>
  new Promise((resolve, reject) => {
    const upload = cloudinary.uploader.upload_stream(
      { folder, resource_type: 'raw', format: 'pdf' },
      (err, result) => (err ? reject(err) : resolve(result)),
    );
    Readable.from(buffer).pipe(upload);
  });

export const deleteAsset = (publicId) =>
  cloudinary.uploader.destroy(publicId, { resource_type: 'raw' });
