import axios, { AxiosRequestConfig } from 'axios';
import * as authApi from '@/api/auth';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
});

let isRefreshing = false;
let pendingRequests: ((token: string) => void)[] = [];

function processQueue(token: string) {
  pendingRequests.forEach((callback) => callback(token));
  pendingRequests = [];
}

api.interceptors.response.use((res) => res, async (error) => {
  const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };

  // Access token이 만료된 경우
  if (error.response?.status === 401 && !originalRequest._retry) {
    originalRequest._retry = true;

    if (!isRefreshing) {
      console.log('Access token expired, refreshing...');
      isRefreshing = true;

      try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (refreshToken) {
          const response = await authApi.refreshToken(refreshToken) // await axios.post(`${import.meta.env.VITE_API_BASE_URL}/auth/refresh`, { refreshToken });
          const newAccessToken = response.data.accessToken;
          localStorage.setItem('accessToken', newAccessToken);

          processQueue(newAccessToken);

          isRefreshing = false;
          return api(originalRequest);
        }
      } catch (err) {
        console.error('Failed to refresh token:', err);

        isRefreshing = false;
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        pendingRequests = [];

        return Promise.reject(error);
      } finally {
        isRefreshing = false;
      }
    }

    return new Promise((resolve) => {
      pendingRequests.push((token: string) => {
        if (!originalRequest.headers) {
          originalRequest.headers = {};
        }
        originalRequest.headers['Authorization'] = `Bearer ${token}`;
        resolve(api(originalRequest));
      });
    });
  }

  return Promise.reject(error);
});

export default api;