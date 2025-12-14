import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { FileDto } from "./file.dto";

export class UserDto {
  @ApiProperty()
  utag: string;

  @ApiProperty()
  nick: string;

  @ApiPropertyOptional({ type: () => FileDto, nullable: true })
  avatar: FileDto | null;

  @ApiPropertyOptional({ type: String, nullable: true })
  email: string | null;

  @ApiPropertyOptional({ type: String, nullable: true })
  statusMessage: string | null;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
