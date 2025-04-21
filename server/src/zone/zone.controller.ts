import { Controller, Get, Param } from "@nestjs/common";
import { ZoneService } from "./zone.service";
import { plainToInstance } from "class-transformer";
import { ZoneDto } from "./dto/zone.dto";
import { ApiOkResponse } from "@nestjs/swagger";

@Controller('api/v1/zones')
export class ZoneController {
  constructor(private readonly zoneService: ZoneService) {}

  @Get(':zoneId')
  @ApiOkResponse({ type: ZoneDto })
  async getZone(@Param('zoneId') zoneId: string): Promise<ZoneDto | null> {
    const zone = await this.zoneService.getZone(zoneId);

    if (!zone) return null;
    return plainToInstance(ZoneDto, zone);
  }
}
