import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class UpdateWorkspaceDto {
  @ApiProperty()
  @IsString()
  name?: string;

  @ApiProperty()
  @IsString()
  description?: string;
}