import { PublicUserDto } from "@/user/dto/public-user.dto";
import { ApiProperty } from "@nestjs/swagger";
import { Exclude } from "class-transformer";

export class ChatMessageDto {
  @ApiProperty()
  messageId: string;
  @ApiProperty()
  vaultId: string;
  @ApiProperty()
  zoneId: string;
  @Exclude()
  userId: string;
  @ApiProperty()
  content: string;
  @ApiProperty()
  createdAt: Date;
  @ApiProperty()
  sender: PublicUserDto;

  constructor(input: Partial<ChatMessageDto>) {
    Object.assign(this, input);
  }
}
