import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class CreateTextChatMessageDto {
  @ApiProperty()
  @IsString()
  text: string;
}