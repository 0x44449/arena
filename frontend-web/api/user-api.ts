import { AxiosProgressEvent } from "axios";
import api from "./api.axios";
import { RegisterUserDto, UpdateUserProfileDto, UserDto } from "./generated";
import { ApiResultDto } from "./models/api-result";

async function getMe() {
  const response = await api.get<ApiResultDto<UserDto>>('/api/v1/users/me');
  return response.data;
}

async function registerUser(user: RegisterUserDto) {
  const response = await api.post<ApiResultDto<UserDto>>('/api/v1/users', user);
  return response.data;
}

async function updateProfile(profile: UpdateUserProfileDto) {
  const response = await api.patch<ApiResultDto<UserDto>>('/api/v1/users/me/profile', profile);
  return response.data;
}

async function uploadAvatar(file: File, options?: {
  onProgress?: (progress: number) => void;
  onStart?: () => void;
  onComplete?: () => void;
  onAbort?: () => void;
  onError?: (error: unknown) => void;
  timeout?: number;
  signal?: AbortSignal;
}): Promise<ApiResultDto<UserDto>> {
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
    signal: options?.signal,
  }

  options?.onStart?.();

  try {
    const response = await api.patch<ApiResultDto<UserDto>>('/api/v1/users/me/profile/avatar', formData, config);
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

const userApi = {
  getMe,
  registerUser,
  updateProfile,
  uploadAvatar,
};
export default userApi;
