import { AuthGuard } from "@/guards/auth.guard";
import { Body, Controller, Get, Param, Post, Query, UseGuards } from "@nestjs/common";
import { ApiBearerAuth } from "@nestjs/swagger";
import { ChatService } from "./chat.service";
import { ChatMessageDto } from "@/dtos/chat-message.dto";
import { ApiResult } from "@/dtos/api-result.dto";
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

  @Get(':workspaceId/messages')
  @ApiOkResultWith(infinityPagedOf(ChatMessageDto))
  async getChatMessages(
    @Param('workspaceId') workspaceId: string,
    @ReqCred() credential: ArenaCredential,
    @Query() query: GetChatMessagesQuery,
  ): Promise<ApiResult<InfinityPagedDto<ChatMessageDto>>> {
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

    const paged = await this.chatService.getPagedMessagesByWorkspaceId(workspaceId, seq, limit, direction);

    const result = new ApiResult<InfinityPagedDto<ChatMessageDto>>({
      data: new InfinityPagedDto<ChatMessageDto>({
        items: paged.items.map(message => ChatMessageDto.fromEntity(message)),
        hasNext: paged.hasNext,
        hasPrev: paged.hasPrev
      })
    });
    return result;
  }

  @Post(':workspaceId/messages')
  @ApiOkResultWith(singleOf(ChatMessageDto))
  async createChatMessage(
    @Param('workspaceId') workspaceId: string,
    @Body() param: CreateChatMessageDto,
    @ReqCred() credential: ArenaCredential
  ): Promise<ApiResult<ChatMessageDto>> {
    const messageEntity = await this.chatService.createMessage(workspaceId, param, credential.user);
    const messageDto = ChatMessageDto.fromEntity(messageEntity);

    const result = new ApiResult<ChatMessageDto>({ data: messageDto });
    return result;
  }
}