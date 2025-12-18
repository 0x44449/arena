import { MessageEntity } from "src/entities/message.entity";
import { MessageDto } from "src/dtos/message.dto";
import { UserDto } from "src/dtos/user.dto";

export function toMessageDto(
  entity: MessageEntity,
  senderDto: UserDto,
): MessageDto {
  return {
    messageId: entity.messageId,
    channelId: entity.channelId,
    sender: senderDto,
    content: entity.content,
    createdAt: entity.createdAt,
  };
}
