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

  if (token) {
    try {
      const header = JSON.parse(atob(token.split(".")[0]));
      console.log(`[API] ${config.method?.toUpperCase()} ${config.url} token=OK alg=${header.alg}`);
    } catch {
      console.log(`[API] ${config.method?.toUpperCase()} ${config.url} token=OK`);
    }
  } else {
    console.log(`[API] ${config.method?.toUpperCase()} ${config.url} token=NONE`);
  }

  // Orval이 @CurrentUser 파라미터를 params(쿼리)로 생성하므로 jwt 키 제거
  const { jwt: _jwt, ...cleanParams } = config.params ?? {};

  const source = axios.CancelToken.source();
  try {
    const response = await apiClient({
      ...config,
      ...options,
      params: { ...cleanParams, ...options?.params },
      headers: {
        ...config.headers,
        ...options?.headers,
        Authorization: token ? `Bearer ${token}` : "",
      },
      cancelToken: source.token,
    });
    console.log(`[API] ${config.method?.toUpperCase()} ${config.url} → ${response.status}`);
    return response.data;
  } catch (e: any) {
    console.error(`[API] ${config.method?.toUpperCase()} ${config.url} → ${e.response?.status ?? "NETWORK_ERROR"}`, e.response?.data ?? e.message);
    throw e;
  }
};

export default apiClient;
