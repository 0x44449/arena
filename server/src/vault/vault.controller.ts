import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { VaultService } from "./vault.service";
import { ZoneService } from "@/zone/zone.service";
import { VaultDto } from "./dto/vault.dto";
import { ApiBody, ApiOkResponse } from "@nestjs/swagger";
import { plainToInstance } from "class-transformer";
import { ZoneDto } from "@/zone/dto/zone.dto";
import { CreateVaultDto } from "./dto/create-vault.dto";

@Controller('api/v1/vaults')
export class VaultController {
  constructor(
    private readonly vaultService: VaultService,
    private readonly zoneService: ZoneService
  ) {}

  @Post()
  @ApiOkResponse({ type: VaultDto })
  @ApiBody({ type: CreateVaultDto })
  async createVault(@Body() dto: CreateVaultDto): Promise<VaultDto> {
    console.log('param:', dto, dto.constructor.name);
    const vault = await this.vaultService.createVault(dto, 'zina-001');

    return plainToInstance(VaultDto, vault);
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
