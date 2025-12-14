import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsString } from "class-validator";

export class CreateFileDto {
  @ApiProperty({ description: 'Storage key (presigned URL 발급 시 받은 값)' })
  @IsString()
  key: string;

  @ApiProperty({ description: 'MIME 타입' })
  @IsString()
  mimeType: string;

  @ApiProperty({ description: '파일 크기 (bytes)' })
  @IsNumber()
  size: number;

  @ApiProperty({ description: '원본 파일명' })
  @IsString()
  originalName: string;
}
