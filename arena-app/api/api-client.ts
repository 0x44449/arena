import { supabase } from "@/libs/supabase";
import axios, { type AxiosRequestConfig } from "axios";

const apiClient = axios.create({
  baseURL: "http://localhost:8002",
});

apiClient.interceptors.request.use(
  async (config) => {
    const { data } = await supabase.auth.getSession();

    if (data.session?.access_token) {
      config.headers.Authorization = `Bearer ${data.session.access_token}`;
    }

    return config;
  }
);

export const apiClientProxy = async <T>(
  config: AxiosRequestConfig,
  options?: AxiosRequestConfig,
): Promise<T> => {
  const { data: { session } } = await supabase.auth.getSession();
  const token = session?.access_token;

  // 2-2. 헤더 병합
  const source = axios.CancelToken.source();
  const promise = apiClient({
    ...config,
    ...options,
    headers: {
      ...config.headers,
      ...options?.headers,
      Authorization: token ? `Bearer ${token}` : '', // 토큰 주입
    },
    cancelToken: source.token,
  });

  // @ts-ignore (Orval의 타입 호환성을 위해 필요)
  promise.cancel = () => {
    source.cancel('Query was cancelled');
  };

  const { data } = await promise;
  return data;
}

export default apiClient;