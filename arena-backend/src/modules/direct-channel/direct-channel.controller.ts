import { Body, Controller, Get, Param, Post, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { ArenaJwtAuthGuard } from "src/guards/arena-jwt-auth-guard";
import { CurrentUser } from "src/decorators/current-user.decorator";
import { CreateDirectChannelDto } from "./dtos/create-direct-channel.dto";
import type { JwtPayload } from "src/types/jwt-payload.interface";

@ApiTags("direct-channels")
@Controller("/api/v1/direct-channels")
@UseGuards(ArenaJwtAuthGuard)
@ApiBearerAuth()
export class DirectChannelController {
  constructor() {}

  // DM 생성 (또는 기존 DM 반환)
  @Post()
  async createDirectChannel(
    @CurrentUser() user: JwtPayload,
    @Body() dto: CreateDirectChannelDto,
  ) {
    // TODO
  }

  // 내 DM 목록
  @Get()
  async getMyDirectChannels(@CurrentUser() user: JwtPayload) {
    // TODO
  }

  // DM 상세 조회
  @Get(":channelId")
  async getDirectChannel(
    @CurrentUser() user: JwtPayload,
    @Param("channelId") channelId: string,
  ) {
    // TODO
  }
}
