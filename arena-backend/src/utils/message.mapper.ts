import { MessageEntity } from "src/entities/message.entity";
import { MessageDto } from "src/dtos/message.dto";
import { toUserDto } from "./user.mapper";

export function toMessageDto(entity: MessageEntity): MessageDto {
  return {
    messageId: entity.messageId,
    channelId: entity.channelId,
    sender: toUserDto(entity.sender),
    seq: Number(entity.seq),
    content: entity.content,
    createdAt: entity.createdAt,
    updatedAt: entity.updatedAt,
  };
}
