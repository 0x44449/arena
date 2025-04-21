import { PublicUserDto } from "@/user/dto/public-user.dto";
import { Exclude } from "class-transformer";

export class ChatMessageDto {
  messageId: string;
  vaultId: string;
  zoneId: string;
  @Exclude()
  userId: string;
  content: string;
  createdAt: Date;
  sender: PublicUserDto;

  constructor(input: Partial<ChatMessageDto>) {
    Object.assign(this, input);
  }
}
