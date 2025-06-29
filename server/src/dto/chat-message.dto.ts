import { Exclude } from "class-transformer";
import { PublicUserDto } from "./public-user.dto";
import { ChatMessageEntity } from "@/entity/chat-message.entity";
import { ChatAttachmentDto } from "./chat-attachment.dto";

export class ChatMessageDto {
  messageId: string;
  featureId: string;

  @Exclude()
  userId: string;

  text: string;
  createdAt: Date;
  updatedAt: Date;

  @Exclude()
  senderId: string;

  sender: PublicUserDto;
  attachments: ChatAttachmentDto[];

  static fromEntity(entity: ChatMessageEntity): ChatMessageDto {
    const instance = new ChatMessageDto();
    Object.assign(instance, entity);
    return instance;
  }
}