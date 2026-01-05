import { ApiProperty } from "@nestjs/swagger";

export class FileDto {
  @ApiProperty({ description: "파일 ID" })
  fileId: string;

  @ApiProperty({ description: "파일 URL" })
  url: string;

  @ApiProperty({ description: "파일명" })
  name: string;

  @ApiProperty({ description: "MIME 타입" })
  mimeType: string;

  @ApiProperty({ description: "파일 크기 (bytes)" })
  size: number;

  @ApiProperty({ description: "생성 시간" })
  createdAt: Date;

  @ApiProperty({ description: "수정 시간" })
  updatedAt: Date;
}
