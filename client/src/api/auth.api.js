import { api } from './axios.js';
export const authApi = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  logout: () => api.post('/auth/logout'),
  me: () => api.get('/auth/me'),
  forgot: (email) => api.post('/auth/forgot-password', { email }),
  reset: (token, pwd) => api.post('/auth/reset-password', { token, password: pwd }),
  updateProfile: (data) => api.patch('/users/me', data),
  socketTicket: () => api.get('/auth/socket-ticket'),
};
