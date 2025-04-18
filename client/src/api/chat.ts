import api from "@/lib/api";
import { Message } from "@/types/api";

export async function getMessages(vaultId: string, zoneId: string) {
  const response = await api.get<Message[]>(`/chat/messages/${vaultId}/${zoneId}`);
  return response.data;
}
