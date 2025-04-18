import { Controller, Get, Param } from "@nestjs/common";
import { PrismaClient } from "@prisma/client";

@Controller('vaults')
export class VaultController {
  constructor(private readonly prisma: PrismaClient) {}

  @Get()
  async getVaults() {
    return await this.prisma.vault.findMany();
  }

  @Get(':vaultId')
  async getVault(@Param('vaultId') vaultId: string) {
    return await this.prisma.vault.findUnique({
      where: { vaultId },
    });
  }

  @Get(':vaultId/zones')
  async getZones(@Param('vaultId') vaultId: string) {
    return await this.prisma.zone.findMany({
      where: { vaultId },
    });
  }
}
