import axios, { AxiosInstance, InternalAxiosRequestConfig, AxiosResponse } from 'axios';

// ─── Token store (in-memory, never localStorage) ───────────────────────────
let accessToken: string | null = null;

export const tokenStore = {
  get: () => accessToken,
  set: (token: string) => { accessToken = token; },
  clear: () => { accessToken = null; },
};

// ─── Axios instance ─────────────────────────────────────────────────────────
const defaultBaseUrl = import.meta.env.DEV
  ? 'http://localhost:8080'
  : 'https://sportsync-backend-h7er.onrender.com';

const api: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? defaultBaseUrl,
  headers: { 'Content-Type': 'application/json' },
  timeout: 10_000,
});

// ─── Request interceptor — attach JWT ───────────────────────────────────────
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = tokenStore.get();
    if (token && config.headers) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// ─── Response interceptor — handle 401 ──────────────────────────────────────
api.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error) => {
    if (error.response?.status === 401) {
      tokenStore.clear();
      // Redirect to login — works with React Router history
      window.dispatchEvent(new CustomEvent('auth:expired'));
    }
    return Promise.reject(error);
  },
);

export default api;
