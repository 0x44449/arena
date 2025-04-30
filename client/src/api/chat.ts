import api from "@/lib/api";
import ApiResult from "@/types/api-result.dto";
import ChatMessageDto from "@/types/chat-message.dto";

export async function getMessages(featureId: string): Promise<ApiResult<ChatMessageDto[]>> {
  const response = await api.get<ApiResult<ChatMessageDto[]>>(`/api/v1/chat/${featureId}/messages`);
  return response.data;
}
