import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsNumber, IsString } from "class-validator";

export class CreateWorkspaceFeatureDto {
  @ApiProperty()
  @IsString()
  featureType: string;

  @ApiProperty()
  @IsNumber()
  order: number;

  @ApiProperty()
  @IsBoolean()
  isDefault: boolean;
}