import axios from 'axios';

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api/v1',
  withCredentials: true,
});

let refreshing = null;
const subscribers = [];
const onRefreshed = () => { subscribers.forEach((cb) => cb()); subscribers.length = 0; };

api.interceptors.response.use(
  (r) => r,
  async (error) => {
    const original = error.config;
    if (error.response?.status !== 401 || original._retry || original.url.includes('/auth/')) {
      return Promise.reject(error);
    }
    original._retry = true;

    if (!refreshing) {
      refreshing = api.post('/auth/refresh').finally(() => { refreshing = null; onRefreshed(); });
    }
    try { await refreshing; }
    catch { return Promise.reject(error); }

    return new Promise((resolve) => {
      subscribers.push(() => resolve(api(original)));
    });
  },
);
