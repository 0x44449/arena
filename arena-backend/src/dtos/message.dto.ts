import { ApiProperty } from "@nestjs/swagger";
import { UserDto } from "./user.dto";

export class MessageDto {
  @ApiProperty({ description: "메시지 ID" })
  messageId: string;

  @ApiProperty({ description: "채널 ID" })
  channelId: string;

  @ApiProperty({ description: "보낸 사람" })
  sender: UserDto;

  @ApiProperty({ description: "메시지 내용" })
  content: string;

  @ApiProperty({ description: "보낸 시간" })
  createdAt: Date;
}
