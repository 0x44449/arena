import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class CreateDirectChannelDto {
  @ApiProperty({ description: '대화 상대 userId' })
  @IsString()
  userId: string;
}
