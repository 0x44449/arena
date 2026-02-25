import { supabase } from "@/libs/supabase";
import axios, { type AxiosRequestConfig } from "axios";
import Constants from "expo-constants";

const extra = Constants.expoConfig?.extra;

const apiClient = axios.create({
  baseURL: extra?.apiBaseUrl ?? "http://localhost:18080",
});

apiClient.interceptors.request.use(async (config) => {
  const { data } = await supabase.auth.getSession();
  if (data.session?.access_token) {
    config.headers.Authorization = `Bearer ${data.session.access_token}`;
  }
  return config;
});

export const apiClientProxy = async <T>(
  config: AxiosRequestConfig,
  options?: AxiosRequestConfig
): Promise<T> => {
  const {
    data: { session },
  } = await supabase.auth.getSession();
  const token = session?.access_token;

  const source = axios.CancelToken.source();
  const promise = apiClient({
    ...config,
    ...options,
    headers: {
      ...config.headers,
      ...options?.headers,
      Authorization: token ? `Bearer ${token}` : "",
    },
    cancelToken: source.token,
  });

  // @ts-ignore — Orval 호환
  promise.cancel = () => {
    source.cancel("Query was cancelled");
  };

  const { data } = await promise;
  return data;
};

export default apiClient;
