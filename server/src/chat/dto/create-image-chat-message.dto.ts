import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class CreateImageChatMessageDto {
  @ApiProperty()
  @IsString()
  text: string;
}