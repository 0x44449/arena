import { Exclude, Expose } from "class-transformer";
import { PublicUserDto } from "./public-user.dto";
import { ChatMessageEntity } from "@/entity/chat-message.entity";
import { ChatAttachmentDto } from "./chat-attachment.dto";

export class ChatMessageDto {
  @Expose()
  messageId: string;

  @Expose()
  featureId: string;

  @Exclude()
  userId: string;

  @Expose()
  text: string;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;

  @Exclude()
  senderId: string;

  @Expose()
  sender: PublicUserDto;

  @Expose()
  attachments: ChatAttachmentDto[];

  static fromEntity(entity: ChatMessageEntity): ChatMessageDto {
    const instance = new ChatMessageDto();
    Object.assign(instance, entity);
    return instance;
  }
}