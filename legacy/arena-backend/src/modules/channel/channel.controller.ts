import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { ArenaJwtAuthGuard } from 'src/guards/arena-jwt-auth-guard';
import { SessionGuard } from '../session/session.guard';
import { CurrentUser } from 'src/decorators/current-user.decorator';
import { CreateDirectChannelDto } from './dtos/create-direct-channel.dto';
import { CreateGroupChannelDto } from './dtos/create-group-channel.dto';
import { ChannelService } from './channel.service';
import { DirectChannelService } from './direct-channel.service';
import { GroupChannelService } from './group-channel.service';
import { toChannelDto } from 'src/utils/channel.mapper';
import { ChannelDto } from 'src/dtos/channel.dto';
import {
  withSingleApiResult,
  type SingleApiResultDto,
} from 'src/dtos/single-api-result.dto';
import {
  withListApiResult,
  type ListApiResultDto,
} from 'src/dtos/list-api-result.dto';
import type { CachedUser } from '../session/session.types';

@ApiTags('channels')
@Controller('/api/v1/channels')
@UseGuards(ArenaJwtAuthGuard, SessionGuard)
@ApiBearerAuth()
export class ChannelController {
  constructor(
    private readonly channelService: ChannelService,
    private readonly directChannelService: DirectChannelService,
    private readonly groupChannelService: GroupChannelService,
  ) {}

  @Post('direct')
  @ApiOperation({ summary: 'DM 생성 (이미 있으면 기존 반환)', operationId: 'createDirectChannel' })
  @ApiOkResponse({ type: () => withSingleApiResult(ChannelDto) })
  async createDirectChannel(
    @CurrentUser() user: CachedUser,
    @Body() dto: CreateDirectChannelDto,
  ): Promise<SingleApiResultDto<ChannelDto>> {
    const { channel, participants } =
      await this.directChannelService.getOrCreate(user.userId, dto.userId);

    return {
      success: true,
      data: toChannelDto(channel, null, participants),
      errorCode: null,
    };
  }

  @Post('group')
  @ApiOperation({ summary: '그룹 채널 생성', operationId: 'createGroupChannel' })
  @ApiOkResponse({ type: () => withSingleApiResult(ChannelDto) })
  async createGroupChannel(
    @CurrentUser() user: CachedUser,
    @Body() dto: CreateGroupChannelDto,
  ): Promise<SingleApiResultDto<ChannelDto>> {
    const { channel, groupChannel, participants } =
      await this.groupChannelService.create(
        user.userId,
        dto.name,
        dto.userIds ?? [],
        dto.iconFileId ?? null,
      );

    return {
      success: true,
      data: toChannelDto(channel, groupChannel, participants),
      errorCode: null,
    };
  }

  @Get()
  @ApiOperation({ summary: '내 채널 목록', operationId: 'getMyChannels' })
  @ApiOkResponse({ type: () => withListApiResult(ChannelDto) })
  async getMyChannels(
    @CurrentUser() user: CachedUser,
  ): Promise<ListApiResultDto<ChannelDto>> {
    const results = await this.channelService.getMyChannels(user.userId);

    return {
      success: true,
      data: results.map((r) =>
        toChannelDto(r.channel, r.groupChannel, r.participants),
      ),
      errorCode: null,
    };
  }

  @Get(':channelId')
  @ApiOperation({ summary: '채널 상세 조회', operationId: 'getChannel' })
  @ApiOkResponse({ type: () => withSingleApiResult(ChannelDto) })
  async getChannel(
    @CurrentUser() user: CachedUser,
    @Param('channelId') channelId: string,
  ): Promise<SingleApiResultDto<ChannelDto>> {
    const details = await this.channelService.getChannel(
      channelId,
      user.userId,
    );

    return {
      success: true,
      data: toChannelDto(
        details.channel,
        details.groupChannel,
        details.participants,
      ),
      errorCode: null,
    };
  }
}
