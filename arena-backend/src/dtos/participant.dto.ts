import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { UserDto } from "./user.dto";

export class ParticipantDto {
  @ApiProperty({ description: "유저 정보" })
  user: UserDto;

  @ApiPropertyOptional({
    type: Date,
    nullable: true,
    description: "마지막 읽은 시간",
  })
  lastReadAt: Date | null;

  @ApiProperty({ description: "참여 시간" })
  joinedAt: Date;
}
