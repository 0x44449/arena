import { ApiProperty } from "@nestjs/swagger";

export class PresignedUrlDto {
  @ApiProperty({ description: 'S3 업로드 URL' })
  uploadUrl: string;

  @ApiProperty({ description: 'S3 key (업로드 후 서버에 전달)' })
  key: string;

  @ApiProperty({ description: 'URL 만료 시간 (초)' })
  expiresIn: number;
}
