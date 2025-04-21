import { Injectable } from "@nestjs/common";
import { PrismaClient } from "@prisma/client";
import { ZoneDto } from "./dto/zone.dto";
import { UserService } from "@/user/user.service";
import { PublicUserDto } from "@/user/dto/public-user.dto";

@Injectable()
export class ZoneService {
  constructor(
    private readonly prisma: PrismaClient,
    private readonly userService: UserService
  ) {}

  async createZone(vaultId: string, name: string, description: string, hasChat: boolean, hasBoard: boolean) {
    const zone = await this.prisma.zone.create({
      data: {
        vaultId,
        name,
        description,
        hasChat,
        hasBoard,
        ownerId: ''
      },
    });
    return zone;
  }

  async getZonesByVaultId(vaultId: string): Promise<ZoneDto[]> {
    const zones = await this.prisma.zone.findMany({
      where: { vaultId },
    });

    // User 매핑
    const result = await Promise.all(
      zones.map(async (zone) => {
        const user = await this.userService.getUser(zone.ownerId);

        const zoneDto = new ZoneDto(zone);
        if (user) {
          zoneDto.owner = new PublicUserDto(user);
        }
        return zoneDto;
      })
    );
    return result;
  }

  async getZone(zoneId: string): Promise<ZoneDto | null> {
    const zone = await this.prisma.zone.findUnique({
      where: { zoneId },
    });

    if (!zone) return null;
    // User 매핑
    const user = await this.userService.getUser(zone.ownerId);
    const zoneDto = new ZoneDto(zone);
    if (user) {
      zoneDto.owner = new PublicUserDto(user);
    }
    return zoneDto;
  }
}
