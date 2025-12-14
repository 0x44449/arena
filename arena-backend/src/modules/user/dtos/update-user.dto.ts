import { IsOptional, IsString, Length, MaxLength } from "class-validator";
import { ApiPropertyOptional } from "@nestjs/swagger";

export class UpdateUserDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @Length(1, 32)
  nick?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(140)
  statusMessage?: string;

  @ApiPropertyOptional({ description: 'S3 storage key for avatar' })
  @IsOptional()
  @IsString()
  avatarKey?: string;
}
