// src/lib/axios.ts
import axios from 'axios';
import { getToken, setAuthSession, clearAuthSession } from './storage';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

const refreshClient = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

let isRefreshing = false;
let refreshQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
  refreshQueue.forEach((p) => {
    if (error) p.reject(error);
    else p.resolve(token);
  });
  refreshQueue = [];
};

// Handle expired access token
api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url?.includes('/auth/login')
    ) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          refreshQueue.push({
            resolve: (token: string) => {
              originalRequest.headers.Authorization = `Bearer ${token}`;
              resolve(api(originalRequest));
            },
            reject,
          });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const res = await refreshClient.post('/auth/refresh');
        // Backend returns: { "status": "Success", "data": { "accessToken": "..." } }
        const { accessToken } = res.data.data;

        setAuthSession({ accessToken });
        processQueue(null, accessToken);

        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return api(originalRequest);
      } catch (err) {
        processQueue(err);
        clearAuthSession();
        // notify the app that auth/session is no longer valid so UI can react
        try {
          window.dispatchEvent(new Event('auth:logout'));
        } catch (e) {
          // ignore if window not available
        }
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  },
);

export default api;
