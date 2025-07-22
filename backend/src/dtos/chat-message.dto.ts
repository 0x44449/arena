import { ChatMessageEntity } from "@/entities/chat-message.entity";
import { OmitType } from "@nestjs/swagger";
import { UserDto } from "./user.dto";
import { FileDto } from "./file.dto";

export class ChatMessageDto extends OmitType(
  ChatMessageEntity,
  [
    'sender',
    'senderId',
    'attachments',
  ] as const
) {
  sender: UserDto;
  attachments: FileDto[];

  public static fromEntity(entity: ChatMessageEntity): ChatMessageDto {
    return {
      messageId: entity.messageId,
      seq: entity.seq,
      workspaceId: entity.workspaceId,
      message: entity.message,
      sender: UserDto.fromEntity(entity.sender),
      attachments: entity.attachments.map(file => FileDto.fromEntity(file)),
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt
    }
  }
}