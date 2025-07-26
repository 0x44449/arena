import { AuthGuard } from "@/guards/auth.guard";
import { Body, Controller, Get, Param, Post, Query, UseGuards } from "@nestjs/common";
import { ApiBearerAuth } from "@nestjs/swagger";
import { ChatService } from "./chat.service";
import { ChatMessageDto } from "@/dtos/chat-message.dto";
import { ApiResultDto } from "@/dtos/api-result.dto";
import { InfinityPagedDto } from "@/dtos/infinity-paged.dto";
import { CreateChatMessageDto } from "./dtos/create-chat-message.dto";
import ReqCred from "@/decorators/req-cred.decorator";
import ArenaCredential from "@/commons/arena-credential";
import { ApiOkResultWith } from "@/decorators/api-ok-result-with.decorator";
import { infinityPagedOf, singleOf } from "@/dtos/dto-schema-factories";
import { GetChatMessagesQuery } from "./queries/get-chat-messages.query";

@Controller('api/v1/chat')
@UseGuards(AuthGuard)
@ApiBearerAuth('access-token')
export class ChatController {
  constructor(
    private readonly chatService: ChatService,
  ) {}

  @Get(':channelId/messages')
  @ApiOkResultWith(infinityPagedOf(ChatMessageDto))
  async getChatMessages(
    @Param('channelId') channelId: string,
    @ReqCred() credential: ArenaCredential,
    @Query() query: GetChatMessagesQuery,
  ): Promise<ApiResultDto<InfinityPagedDto<ChatMessageDto>>> {
    let { seq, limit, direction } = query;

    if (typeof seq !== 'number') {
      seq = -1;
    }
    if (typeof limit !== 'number') {
      limit = 20;
    }
    if (!direction || (direction !== 'prev' && direction !== 'next')) {
      direction = 'prev';
    }

    const paged = await this.chatService.getPagedMessagesByChannelId(channelId, seq, limit, direction);

    const result = new ApiResultDto<InfinityPagedDto<ChatMessageDto>>({
      data: new InfinityPagedDto<ChatMessageDto>({
        items: paged.items.map(message => ChatMessageDto.fromEntity(message)),
        hasNext: paged.hasNext,
        hasPrev: paged.hasPrev
      })
    });
    return result;
  }

  @Post(':channelId/messages')
  @ApiOkResultWith(singleOf(ChatMessageDto))
  async createChatMessage(@Param('channelId') channelId: string, @Body() param: CreateChatMessageDto, @ReqCred() credential: ArenaCredential): Promise<ApiResultDto<ChatMessageDto>> {
    const messageEntity = await this.chatService.createMessage(channelId, param, credential.user);
    const messageDto = ChatMessageDto.fromEntity(messageEntity);

    const result = new ApiResultDto<ChatMessageDto>({ data: messageDto });
    return result;
  }
}