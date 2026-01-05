import { ApiProperty } from "@nestjs/swagger";
import { UserDto } from "./user.dto";

export class ContactDto {
  @ApiProperty({ description: "연락처에 저장된 유저 정보" })
  user: UserDto;

  @ApiProperty({ description: "추가한 시간" })
  createdAt: Date;

  @ApiProperty({ description: "수정 시간" })
  updatedAt: Date;
}
