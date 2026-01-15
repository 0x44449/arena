import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { ArenaJwtAuthGuard } from 'src/guards/arena-jwt-auth-guard';
import { SessionGuard } from '../session/session.guard';
import { ApiResultDto } from 'src/dtos/api-result.dto';
import { RegisterDeviceDto } from './dtos/register-device.dto';
import { UnregisterDeviceDto } from './dtos/unregister-device.dto';
import { DeviceService } from './device.service';
import { CurrentUser } from 'src/decorators/current-user.decorator';
import type { CachedUser } from '../session/session.types';

@ApiTags('devices')
@Controller('/api/v1/devices')
@UseGuards(ArenaJwtAuthGuard, SessionGuard)
@ApiBearerAuth()
export class DeviceController {
  constructor(private readonly deviceService: DeviceService) {}

  @Post('register')
  @ApiOperation({ summary: '디바이스 등록', operationId: 'registerDevice' })
  @ApiOkResponse({ type: ApiResultDto })
  async registerDevice(
    @CurrentUser() user: CachedUser,
    @Body() dto: RegisterDeviceDto,
  ): Promise<ApiResultDto> {
    await this.deviceService.registerDevice(user.userId, dto);
    return {
      success: true,
      errorCode: null,
    };
  }

  @Post('unregister')
  @ApiOperation({ summary: '디바이스 해제', operationId: 'unregisterDevice' })
  @ApiOkResponse({ type: ApiResultDto })
  async unregisterDevice(
    @Body() dto: UnregisterDeviceDto,
  ): Promise<ApiResultDto> {
    await this.deviceService.unregisterDevice(dto);
    return {
      success: true,
      errorCode: null,
    };
  }
}
