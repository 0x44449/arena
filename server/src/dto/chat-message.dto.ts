import { ApiProperty } from "@nestjs/swagger";
import { Exclude, Expose } from "class-transformer";
import { PublicUserDto } from "./public-user.dto";
import { ChatMessageEntity } from "@/entity/chat-message.entity";

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
  content: string;

  @ApiProperty()
  @Expose()
  createdAt: Date;

  @ApiProperty()
  @Expose()
  updatedAt: Date;

  @Exclude()
  senderId: string;

  @ApiProperty({ type: PublicUserDto })
  @Expose()
  sender: PublicUserDto;

  constructor(input: Partial<ChatMessageDto> | ChatMessageEntity) {
    Object.assign(this, input);
  }
}