import { api } from './axios.js';
export const analyticsApi = { me: () => api.get('/analytics/me') };
