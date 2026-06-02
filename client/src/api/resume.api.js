import { api } from './axios.js';
export const resumeApi = {
  upload: (file) => {
    const fd = new FormData();
    fd.append('resume', file);
    return api.post('/resumes/analyze', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
  },
  list: () => api.get('/resumes'),
  get: (id) => api.get(`/resumes/${id}`),
  remove: (id) => api.delete(`/resumes/${id}`),
};
