import axios from 'axios';
import { API_BASE_URL, apiEndpoint } from '../config/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
});

// Attach JWT access token from localStorage to every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('ems_token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (err) => Promise.reject(err)
);

// If access token expired (401), attempt silent refresh
api.interceptors.response.use(
  (res) => res,
  async (err) => {
    const original = err.config;
    if (err?.response?.status === 401 && !original._retry) {
      original._retry = true;
      try {
        const refreshRes = await axios.post(
          apiEndpoint('/auth/refresh'),
          {},
          { withCredentials: true }
        );
        const newToken = refreshRes.data.accessToken;
        localStorage.setItem('ems_token', newToken);
        original.headers.Authorization = `Bearer ${newToken}`;
        return api(original);
      } catch {
        localStorage.removeItem('ems_token');
        localStorage.removeItem('ems_user');
        window.location.href = '/ems-login';
      }
    }
    const message = err?.response?.data?.message || err?.message || 'Something went wrong';
    window.dispatchEvent(new CustomEvent('ems:api-error', { detail: { message } }));
    return Promise.reject(err);
  }
);

export default api;
