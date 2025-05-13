import ChatMessageDto from "./chat-message.dto";
import { ChatMessagePayload } from "./chat-message.payload";
import { JoinChatPayload } from "./join-chat.payload";
import { LeaveChatPayload } from "./leave-chat.payload";

export interface ClientToServerEvents {
  'chat:join': (payload: JoinChatPayload) => void;
  'chat:leave': (payload: LeaveChatPayload) => void;
  'chat:message': (payload: ChatMessagePayload) => void;
}

export interface ServerToClientEvents {
  'chat:message': (payload: ChatMessageDto) => void;
} 