import { ChatMessageEntity } from "@/entities/chat-message.entity";
import { OmitType } from "@nestjs/swagger";
import { UserDto } from "./user.dto";

export class ChatMessageDto extends OmitType(
  ChatMessageEntity, [
    "sender",
    "senderId",
    "attachments",
  ] as const
) {
  sender: UserDto;

  public static fromEntity(entity: ChatMessageEntity): ChatMessageDto {
    return {
      messageId: entity.messageId,
      seq: entity.seq,
      channelId: entity.channelId,
      message: entity.message,
      sender: UserDto.fromEntity(entity.sender),
      // attachments: [], // Attachments are omitted in this DTO
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt
    }
  }
}