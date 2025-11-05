import axios from 'axios';

// Determine API base dynamically
const inferredApi = (() => {
  const envUrl = import.meta.env.VITE_API_URL;
  if (envUrl) return envUrl; // explicit override
  if (typeof window !== 'undefined') {
    const host = window.location.hostname || '';
    const isLocal = host === 'localhost' || host === '127.0.0.1';
    if (isLocal) return 'http://localhost:5000/api';
    // Production (e.g., Vercel)
    return 'https://edu-bridge-yhuf.onrender.com/api';
  }
  return 'http://localhost:5000/api';
})();
const API_URL = inferredApi;

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  withCredentials: true, // Important for httpOnly cookies
  timeout: 60000, // 60s default
  maxBodyLength: Infinity,
  maxContentLength: Infinity,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor (can be used to add auth tokens to headers if needed)
api.interceptors.request.use(
  (config) => {
    // Token will be in httpOnly cookie, so no need to add to headers
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling + simple retry once on network error/timeout
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const config = error.config || {};
    const isNetwork = !error.response; // network/timeout
    if (isNetwork && !config.__retried) {
      config.__retried = true;
      await new Promise((r) => setTimeout(r, 500));
      return api(config);
    }

    if (error.response?.status === 401) {
      const url = (config.url || '').toLowerCase();
      const isAuthEndpoint = url.includes('/auth/login') || url.includes('/auth/signup');
      if (!isAuthEndpoint) {
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
