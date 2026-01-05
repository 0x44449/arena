import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { ArenaJwtAuthGuard } from 'src/guards/arena-jwt-auth-guard';
import { SessionGuard } from '../session/session.guard';
import { CurrentUser } from 'src/decorators/current-user.decorator';
import { MessageDto } from 'src/dtos/message.dto';
import {
  withSingleApiResult,
  type SingleApiResultDto,
} from 'src/dtos/single-api-result.dto';
import {
  withInfinityListApiResult,
  type InfinityListApiResultDto,
} from 'src/dtos/infinity-list-api-result.dto';
import { CreateMessageDto } from './dtos/create-message.dto';
import { GetMessagesQueryDto } from './dtos/get-messages-query.dto';
import { SyncMessagesQueryDto } from './dtos/sync-messages-query.dto';
import { MessageSyncDataDto } from './dtos/sync-messages-result.dto';
import { MessageService } from './message.service';
import { toMessageDto } from 'src/utils/message.mapper';
import type { CachedUser } from '../session/session.types';

@ApiTags('messages')
@Controller('/api/v1/messages')
@UseGuards(ArenaJwtAuthGuard, SessionGuard)
@ApiBearerAuth()
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @Post('channel/:channelId')
  @ApiOperation({ summary: '메시지 보내기' })
  @ApiOkResponse({ type: () => withSingleApiResult(MessageDto) })
  async createMessage(
    @CurrentUser() user: CachedUser,
    @Param('channelId') channelId: string,
    @Body() dto: CreateMessageDto,
  ): Promise<SingleApiResultDto<MessageDto>> {
    const message = await this.messageService.createMessage(
      user.userId,
      channelId,
      dto.content,
    );

    return {
      success: true,
      data: toMessageDto(message),
      errorCode: null,
    };
  }

  @Get('channel/:channelId')
  @ApiOperation({ summary: '메시지 목록 조회' })
  @ApiOkResponse({ type: () => withInfinityListApiResult(MessageDto) })
  async getMessages(
    @CurrentUser() user: CachedUser,
    @Param('channelId') channelId: string,
    @Query() query: GetMessagesQueryDto,
  ): Promise<InfinityListApiResultDto<MessageDto>> {
    const result = await this.messageService.getMessages(
      user.userId,
      channelId,
      {
        before: query.before,
        after: query.after,
        around: query.around,
        limit: query.limit,
      },
    );

    return {
      success: true,
      data: result.messages.map(toMessageDto),
      hasNext: result.hasNext,
      hasPrev: result.hasPrev,
      errorCode: null,
    };
  }

  @Get('channel/:channelId/sync')
  @ApiOperation({ summary: '메시지 동기화' })
  @ApiOkResponse({ type: () => withSingleApiResult(MessageSyncDataDto) })
  async syncMessages(
    @CurrentUser() user: CachedUser,
    @Param('channelId') channelId: string,
    @Query() query: SyncMessagesQueryDto,
  ): Promise<SingleApiResultDto<MessageSyncDataDto>> {
    const since = new Date(query.since);
    const result = await this.messageService.syncMessages(
      user.userId,
      channelId,
      since,
    );

    return {
      success: true,
      data: {
        created: result.created.map(toMessageDto),
        updated: result.updated.map(toMessageDto),
        deleted: result.deleted,
        requireFullSync: result.requireFullSync,
      },
      errorCode: null,
    };
  }
}
