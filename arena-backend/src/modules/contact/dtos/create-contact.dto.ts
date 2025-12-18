import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class CreateContactDto {
  @ApiProperty({ description: "추가할 유저 ID" })
  @IsString()
  @IsNotEmpty()
  userId: string;
}
