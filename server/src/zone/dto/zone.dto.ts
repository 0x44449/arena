import { PublicUserDto } from "@/user/dto/public-user.dto";
import { ApiProperty } from "@nestjs/swagger";
import { Zone } from "@prisma/client";

export class ZoneDto {
  @ApiProperty()
  zoneId: string;
  @ApiProperty()
  vaultId: string;
  @ApiProperty()
  name: string;
  @ApiProperty()
  description: string;
  @ApiProperty()
  createdAt: Date;
  @ApiProperty()
  updatedAt: Date;
  @ApiProperty()
  hasChat: boolean;
  @ApiProperty()
  hasBoard: boolean;
  @ApiProperty()
  owner: PublicUserDto | null;

  constructor(input: Partial<ZoneDto> | Zone) {
    Object.assign(this, input);
  }
}