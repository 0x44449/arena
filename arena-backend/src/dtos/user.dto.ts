import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class UserDto {
  @ApiProperty()
  utag: string;

  @ApiProperty()
  nick: string;

  @ApiPropertyOptional({ type: String, nullable: true })
  avatarUrl: string | null;

  @ApiPropertyOptional({ type: String, nullable: true })
  email: string | null;

  @ApiPropertyOptional({ type: String, nullable: true })
  statusMessage: string | null;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
