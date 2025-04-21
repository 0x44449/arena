import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class UpdateVaultDto {
  @ApiProperty()
  @IsString()
  name?: string;

  @ApiProperty()
  @IsString()
  description?: string;
}