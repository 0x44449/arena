import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class UpdateTeamDto {
  @ApiProperty()
  @IsString()
  name?: string;

  @ApiProperty()
  @IsString()
  description?: string;
}