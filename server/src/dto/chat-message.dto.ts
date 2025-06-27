import { ApiProperty } from "@nestjs/swagger";
import { Exclude, Expose } from "class-transformer";
import { PublicUserDto } from "./public-user.dto";
import { ChatMessageEntity } from "@/entity/chat-message.entity";
import { ChatMessageContentDto } from "./chat-message-content.dto";

export class ChatMessageDto {
  @ApiProperty()
  @Expose()
  messageId: string;

  @ApiProperty()
  @Expose()
  featureId: string;

  @Exclude()
  userId: string;

  @ApiProperty()
  @Expose()
  content: ChatMessageContentDto;

  @ApiProperty()
  @Expose()
  createdAt: Date;

  @ApiProperty()
  @Expose()
  updatedAt: Date;

  @Exclude()
  senderId: string;

  @ApiProperty()
  @Expose()
  contentType: 'text' | 'image';

  @ApiProperty({ type: PublicUserDto })
  @Expose()
  sender: PublicUserDto;

  static fromEntity(entity: ChatMessageEntity): ChatMessageDto {
    const instance = new ChatMessageDto();
    Object.assign(instance, entity);
    return instance;
  }
}