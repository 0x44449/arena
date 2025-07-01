import chatApi from "@/api/chat";
import { socket } from "@/lib/socket";
import ChatMessageDto from "@/types/chat-message.dto";
import { create } from "zustand";

interface ChatState {
  featureId: string | null;
  messages: ChatMessageDto[];
  joinChat: (featureId: string) => Promise<void>;
  exitChat: () => void;
}

export const useChatStore = create<ChatState>()((set, get) => ({
  featureId: null,
  messages: [],
  joinChat: async (featureId: string) => {
    const state = get();

    // 이미 해당 채팅에 들어가 있는 경우
    if (state.featureId === featureId) return;

    // 기존 채팅방 나가기
    if (state.featureId) get().exitChat();

    // 상태 초기화
    set({ featureId, messages: [] });

    // * 메세지 로드
    const messagesResponse = await chatApi.getMessages(featureId, {
      take: 10
    });
    if (messagesResponse.success) {
      set({ messages: messagesResponse.data || [] });
    } else {
      console.error("Failed to load messages:", messagesResponse.errorMessage);
      set({ featureId: null, messages: [] });
    }

    // * 채팅방 입장 이벤트 전송
    socket.emit('chat:join', {
      featureId,
    });

    // * 메세지 수신 이벤트 바인딩
    const handleMessage = (payload: ChatMessageDto) => {
      set((state) => ({
        messages: [...state.messages, payload],
      }));
    }
    socket.off('chat:message');
    socket.on('chat:message', handleMessage);
  },
  exitChat: () => {
    const state = get();

    if (!state.featureId) return;

    // * 메세지 수신 이벤트 해제
    socket.off('chat:message');

    // * 채팅방 나가기 이벤트 전송
    socket.emit('chat:leave', {
      featureId: state.featureId,
    });

    // * 상태 초기화
    set({ featureId: null, messages: [] });
  },
}));