import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class CreateMessageDto {
  @ApiProperty({ description: "메시지 내용" })
  @IsString()
  @IsNotEmpty()
  content: string;
}
