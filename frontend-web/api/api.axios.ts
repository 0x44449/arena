import axios, { AxiosInstance, AxiosRequestConfig } from "axios";
import authApi from "./auth-api";

interface ArenaAxiosInstance extends AxiosInstance {
  frontend: AxiosInstance;
}

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  withCredentials: true,
}) as ArenaAxiosInstance;

api.frontend = axios.create({
  withCredentials: true,
});

/**
 * 
 * 토큰 관리를 수동으로 할 경우 사용합니다.
 * 
 **/
type PendingRequest = {
  resolve: (value?: any) => void;
  reject: (error: any) => void;
};

let isRefreshing = false;
let pendingRequests: PendingRequest[] = [];

function processQueue() {
  pendingRequests.forEach(({ resolve }) => {
    console.log('Processing pending request', resolve.name);
    return resolve();
  });
  pendingRequests = [];
}

function processQueueError(error: any) {
  pendingRequests.forEach(({ reject }) => reject(error));
  pendingRequests = [];
}

function useAuthInterceptor(instance: AxiosInstance) {
  instance.interceptors.response.use((res) => res, async (error) => {
    const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };

    // Access token이 만료된 경우
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (error.response?.data?.errorCode === 'ACCESS_TOKEN_EXPIRED') {
        originalRequest._retry = true;

        if (!isRefreshing) {
          console.log('Access token expired, refreshing...');
          isRefreshing = true;
          
          try {
            const refreshed = await authApi.refresh();

            if (!refreshed.success) {
              processQueueError(new Error(refreshed.errorCode));
              location.href = '/login';
              return Promise.reject(error);
            }

            processQueue();

            isRefreshing = false;
            return instance(originalRequest);
          } catch (err) {
            console.error('Failed to refresh token:', err);
            processQueueError(err);

            return Promise.reject(error);
          } finally {
            isRefreshing = false;
          }
        }

        return new Promise((resolve, reject) => {
          pendingRequests.push({ resolve: () => resolve(instance(originalRequest)), reject });
        });
      }
    }

    return Promise.reject(error);
  });
}

useAuthInterceptor(api);
useAuthInterceptor(api.frontend);

export default api;