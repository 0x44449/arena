import api from "@/lib/api";
import ApiResult from "@/types/api-result.dto";
import ChatAttachmentDto from "@/types/chat-attachment.dto";
import ChatMessageDto from "@/types/chat-message.dto";
import { AxiosProgressEvent } from "axios";

export async function getMessages(featureId: string): Promise<ApiResult<ChatMessageDto[]>> {
  const response = await api.get<ApiResult<ChatMessageDto[]>>(`/api/v1/chat/${featureId}/messages`);
  return response.data;
}

export async function sendMessage(featureId: string, param: {
  text: string;
  attachmentIds?: string[];
}): Promise<ApiResult<ChatMessageDto>> {
  const response = await api.post<ApiResult<ChatMessageDto>>(`/api/v1/chat/${featureId}/messages`, {
    text: param.text,
    attachmentIds: param.attachmentIds,
  });
  return response.data;
}

export async function uploadAttachments(featureId: string, files: File[], options?: {
  onProgress?: (progress: number) => void;
  onStart?: () => void;
  onComplete?: () => void;
  onAbort?: () => void;
  onError?: (error: unknown) => void;
  timeout?: number;
  signal?: AbortSignal;
}): Promise<ApiResult<ChatAttachmentDto[]>> {
  const formData = new FormData();
  files.forEach(file => formData.append('files', file));

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
    const response = await api.post<ApiResult<ChatAttachmentDto[]>>(`/api/v1/chat/${featureId}/messages/attachments`, formData, config);

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

const chatApi = {
  getMessages,
  sendMessage,
  uploadAttachments,
};
export default chatApi;