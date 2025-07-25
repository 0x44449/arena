import api from "./api.axios";
import { ChatMessageDto, CreateChatMessageDto } from "./generated";
import { ApiResultDto } from "./models/api-result";
import { InfinityPagedDto } from "./models/infinity-paged.dto";

async function getChatMessagesByWorkspaceId(workspaceId: string, param?:{
  seq?: number,
  limit?: number,
  direction?: 'next' | 'prev',
}) {
  const response = await api.get<ApiResultDto<InfinityPagedDto<ChatMessageDto>>>(`/api/v1/chat/${workspaceId}/messages`, {
    params: param
  });
  return response.data;
}

async function createChatMessage(workspaceId: string, data: CreateChatMessageDto) {
  const response = await api.post<ApiResultDto<ChatMessageDto>>(`/api/v1/chat/${workspaceId}/messages`, data);
  return response.data;
}

const chatApi = {
  getChatMessagesByWorkspaceId,
  createChatMessage,
};
export default chatApi;