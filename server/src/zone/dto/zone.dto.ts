import { PublicUserDto } from "@/user/dto/public-user.dto";
import { Zone } from "@prisma/client";

export class ZoneDto {
  zoneId: string;
  vaultId: string;
  name: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
  hasChat: boolean;
  hasBoard: boolean;
  owner: PublicUserDto | null;

  constructor(input: Partial<ZoneDto> | Zone) {
    Object.assign(this, input);
  }
}