import { Body, Controller, Delete, Get, Param, Post, Put } from "@nestjs/common";
import { VaultService } from "./vault.service";
import { ZoneService } from "@/zone/zone.service";
import { VaultDto } from "./dto/vault.dto";
import { ApiBody, ApiOkResponse } from "@nestjs/swagger";
import { plainToInstance } from "class-transformer";
import { ZoneDto } from "@/zone/dto/zone.dto";
import { CreateVaultDto } from "./dto/create-vault.dto";
import { UpdateVaultDto } from "./dto/update-vault.dto";

@Controller('api/v1/vaults')
export class VaultController {
  constructor(
    private readonly vaultService: VaultService,
    private readonly zoneService: ZoneService
  ) {}

  @Post()
  @ApiOkResponse({ type: VaultDto })
  @ApiBody({ type: CreateVaultDto })
  async createVault(@Body() param: CreateVaultDto): Promise<VaultDto> {
    const vault = await this.vaultService.createVault(param, 'zina-001');

    return plainToInstance(VaultDto, vault);
  }

  @Put(':vaultId')
  @ApiOkResponse({ type: VaultDto })
  @ApiBody({ type: UpdateVaultDto })
  async updateVault(@Param('vaultId') vaultId: string, @Body() param: UpdateVaultDto): Promise<VaultDto | null> {
    const vault = await this.vaultService.updateVault(vaultId, param, 'zina-001');

    if (!vault) return null;
    return plainToInstance(VaultDto, vault);
  }

  @Delete(':vaultId')
  async deleteVault(@Param('vaultId') vaultId: string): Promise<undefined> {
    await this.vaultService.deleteVault(vaultId, 'zina-001');
  }

  @Get()
  @ApiOkResponse({ type: VaultDto, isArray: true })
  async getVaults(): Promise<VaultDto[]> {
    const vaults = await this.vaultService.getVaults();

    return plainToInstance(VaultDto, vaults);
  }

  @Get(':vaultId')
  @ApiOkResponse({ type: VaultDto })
  async getVault(@Param('vaultId') vaultId: string): Promise<VaultDto | null> {
    const vault = await this.vaultService.getVault(vaultId);

    if (!vault) return null;
    return plainToInstance(VaultDto, vault);
  }

  @Get(':vaultId/zones')
  async getZones(@Param('vaultId') vaultId: string): Promise<ZoneDto[]> {
    const zones = await this.zoneService.getZonesByVaultId(vaultId);

    return plainToInstance(ZoneDto, zones);
  }
}
