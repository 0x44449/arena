import { IsOptional, IsString, Length, MaxLength, ValidateIf } from "class-validator";
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

  @ApiPropertyOptional({ description: '아바타 파일 ID (null이면 아바타 제거)', nullable: true })
  @IsOptional()
  @ValidateIf((_, value) => value !== null)
  @IsString()
  avatarFileId?: string | null;
}
