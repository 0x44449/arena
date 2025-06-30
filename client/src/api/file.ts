import api from "@/lib/api";
import { AxiosProgressEvent } from "axios";

export async function uploadFile(file: File, options?: {
  onProgress?: (progress: number) => void;
  onStart?: () => void;
  onComplete?: () => void;
  onAbort?: () => void;
  onError?: (error: unknown) => void;
  timeout?: number;
  signal?: AbortSignal;
}): Promise<any> {
  const form = new FormData();
  form.append('file', file);

  const controller = new AbortController();
  if (options?.signal) {
    options.signal.addEventListener('abort', () => {
      controller.abort();
      options.onAbort?.();
    });
  }

  const config = {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    signal: controller.signal,
    onUploadProgress: (progressEvent: AxiosProgressEvent) => {
      const progress = progressEvent.total
        ? Math.round((progressEvent.loaded * 100) / progressEvent.total)
        : 0;
      options?.onProgress?.(progress);
    },
  };

  options?.onStart?.();

  try {
    const response = await api.post('/api/v1/files', form, config);

    options?.onComplete?.();
    return response.data;
  } catch (error) {
    options?.onError?.(error);
    throw error;
  } finally {
    if (options?.signal) {
      options.signal.removeEventListener('abort', () => {
        controller.abort();
        options.onAbort?.();
      });
    }
  }
}

const fileApi = {
  uploadFile,
};
export default fileApi;