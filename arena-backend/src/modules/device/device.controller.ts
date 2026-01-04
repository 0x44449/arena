import { Body, Controller, Post, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiOkResponse } from "@nestjs/swagger";
import { ArenaJwtAuthGuard } from "src/guards/arena-jwt-auth-guard";
import { ApiResultDto } from "src/dtos/api-result.dto";
import { RegisterDeviceDto } from "./dtos/register-device.dto";
import { UnregisterDeviceDto } from "./dtos/unregister-device.dto";
import { DeviceService } from "./device.service";
import { UserService } from "../user/user.service";
import { CurrentUser } from "src/decorators/current-user.decorator";
import type { JwtPayload } from "src/types/jwt-payload.interface";

@Controller("api/v1/devices")
@UseGuards(ArenaJwtAuthGuard)
@ApiBearerAuth()
export class DeviceController {
  constructor(
    private readonly deviceService: DeviceService,
    private readonly userService: UserService,
  ) {}

  @Post("register")
  @ApiOkResponse({ type: ApiResultDto })
  async registerDevice(
    @CurrentUser() jwt: JwtPayload,
    @Body() dto: RegisterDeviceDto
  ): Promise<ApiResultDto> {
    const user = await this.userService.getByUid(jwt.uid);
    await this.deviceService.registerDevice(user.userId, dto);
    return {
      success: true,
      errorCode: null,
    };
  }

  @Post("unregister")
  @ApiOkResponse({ type: ApiResultDto })
  async unregisterDevice(@Body() dto: UnregisterDeviceDto): Promise<ApiResultDto> {
    await this.deviceService.unregisterDevice(dto);
    return {
      success: true,
      errorCode: null,
    };
  }
}
