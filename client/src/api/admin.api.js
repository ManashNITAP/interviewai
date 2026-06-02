import { api } from './axios.js';
export const adminApi = {
  users: (page = 1) => api.get(`/admin/users?page=${page}`),
  deleteUser: (id) => api.delete(`/admin/users/${id}`),
  resumes: () => api.get('/admin/resumes'),
  interviews: () => api.get('/admin/interviews'),
  analytics: () => api.get('/admin/analytics'),
};
