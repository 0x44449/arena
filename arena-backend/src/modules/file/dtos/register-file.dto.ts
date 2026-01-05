import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class RegisterFileDto {
  @ApiProperty({ description: "Storage key (presigned URL 발급 시 받은 값)" })
  @IsString()
  key: string;

  @ApiProperty({ description: "원본 파일명" })
  @IsString()
  name: string;
}
