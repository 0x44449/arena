import { MessageDto } from "src/dtos/message.dto";

export const SignalChannel = {
  USER_UPDATED: "user:updated",
  MESSAGE_NEW: "message:new",
} as const;

export type SignalChannelType = (typeof SignalChannel)[keyof typeof SignalChannel];

// 채널별 페이로드 타입 정의
export interface SignalPayloadMap {
  [SignalChannel.USER_UPDATED]: { uid: string };
  [SignalChannel.MESSAGE_NEW]: { channelId: string; message: MessageDto };
}
