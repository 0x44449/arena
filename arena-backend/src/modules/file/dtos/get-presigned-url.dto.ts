import { ApiPropertyOptional, ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';

export class GetPresignedUrlDto {
  @ApiPropertyOptional({
    description: '디렉토리 (예: avatars, attachments, group-icons)',
    example: 'avatars',
  })
  @IsString()
  @IsOptional()
  directory?: string;

  @ApiProperty({
    description: 'MIME 타입',
    example: 'image/jpeg',
  })
  @IsString()
  mimeType: string;
}
