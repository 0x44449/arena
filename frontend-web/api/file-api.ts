import { AxiosProgressEvent } from "axios";
import { ApiResultDto } from "./models/api-result";
import { FileDto } from "./generated";
import api from "./api.axios";

async function uploadFile(file: File, options?: {
  onProgress?: (progress: number) => void;
  onStart?: () => void;
  onComplete?: () => void;
  onAbort?: () => void;
  onError?: (error: unknown) => void;
  timeout?: number;
  signal?: AbortSignal;
}): Promise<ApiResultDto<FileDto>> {
  const formData = new FormData();
  formData.append('file', file);

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
    onUploadProgress: (progressEvent: AxiosProgressEvent) => {
      if (options?.onProgress) {
        const progress = Math.round((progressEvent.loaded * 100) / (progressEvent.total || 1));
        options.onProgress(progress);
      }
    },
    timeout: options?.timeout,
    signal: controller.signal,
  };

  options?.onStart?.();

  try {
    const response = await api.post<ApiResultDto<FileDto>>('/api/v1/files', formData, config);
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

async function uploadMultipleFiles(files: File[], options?: {
  onProgress?: (progress: number) => void;
  onStart?: () => void;
  onComplete?: () => void;
  onAbort?: () => void;
  onError?: (error: unknown) => void;
  timeout?: number;
  signal?: AbortSignal;
}): Promise<ApiResultDto<FileDto[]>> {
  const formData = new FormData();
  files.forEach((file) => {
    formData.append('files', file);
  });

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
    onUploadProgress: (progressEvent: AxiosProgressEvent) => {
      if (options?.onProgress) {
        const progress = Math.round((progressEvent.loaded * 100) / (progressEvent.total || 1));
        options.onProgress(progress);
      }
    },
    timeout: options?.timeout,
    signal: controller.signal,
  };

  options?.onStart?.();

  try {
    const response = await api.post<ApiResultDto<FileDto[]>>('/api/v1/files/multiple', formData, config);
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
  uploadMultipleFiles,
};
export default fileApi;