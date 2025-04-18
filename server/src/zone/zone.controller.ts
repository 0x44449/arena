import { Controller, Get, Param } from "@nestjs/common";
import { PrismaClient } from "@prisma/client";

@Controller('zones')
export class ZoneController {
  constructor(private readonly prisma: PrismaClient) {}
  
  @Get(':vaultId')
  async getZones(@Param('vaultId') vaultId: string) {
    return await this.prisma.zone.findMany({
      where: { vaultId },
    });
  }
}
