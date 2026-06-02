import { api } from './axios.js';
export const interviewApi = {
  create: (cfg) => api.post('/interviews', cfg),
  list: () => api.get('/interviews'),
  get: (id) => api.get(`/interviews/${id}`),
  next: (id) => api.get(`/interviews/${id}/next`),
  answer: (id, payload) => api.post(`/interviews/${id}/answer`, payload),
  regenerate: (id, qid) => api.post(`/interviews/${id}/questions/${qid}/regenerate`),
  complete: (id) => api.post(`/interviews/${id}/complete`),
};
