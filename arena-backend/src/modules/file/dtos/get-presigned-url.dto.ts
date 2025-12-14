import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class GetPresignedUrlDto {
  @ApiProperty({ 
    description: '디렉토리 (예: avatars, attachments, group-icons)',
    example: 'avatars' 
  })
  @IsString()
  directory: string;

  @ApiProperty({ 
    description: '파일 확장자',
    example: 'jpg' 
  })
  @IsString()
  fileExtension: string;

  @ApiProperty({ 
    description: 'MIME 타입',
    example: 'image/jpeg' 
  })
  @IsString()
  mimeType: string;
}
