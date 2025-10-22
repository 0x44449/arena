import type ArenaWebCredential from "@/auth/web/arena-web-credential";
import ReqCredential from "@/auth/web/arena-web-credential.decorator";
import { ApiResultDto, withApiResult } from "@/dtos/api-result.dto";
import { ChatMessageDto } from "@/dtos/chat-message.dto";
import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from "@nestjs/common";
import { ApiOkResponse } from "@nestjs/swagger";
import { ChatService } from "./chat.service";
import { InfinityPagedDto, withInfinityPaged } from "@/dtos/infinity-paged.dto";
import { GetChatMessageQueryDto } from "./dtos/get-chat-messages-query.dto";
import { ArenaWebAuthGuard } from "@/auth/web/arena-web-auth-guard";

@Controller("api/v1/chat")
@UseGuards(ArenaWebAuthGuard)
export class ChatController {
  constructor(
    private readonly chatService: ChatService,
  ) {}

  @Get(":channelId/messages")
  @ApiOkResponse({ type: () => withApiResult(withInfinityPaged(ChatMessageDto)) })
  async getPagedMessages(
    @Param("channelId") channelId: string, @Query() query: GetChatMessageQueryDto,
  ): Promise<ApiResultDto<InfinityPagedDto<ChatMessageDto>>> {
    let { seq, limit, direction } = query;

    seq = typeof seq === "number" ? seq : -1;
    limit = typeof limit === "number" ? limit : 20;
    direction = direction === "next" || direction === "prev" ? direction : "prev";

    const messages = await this.chatService.getPagedMessages(channelId, {
      baseSeq:  seq,
      limit: limit,
      direction: direction,
    });

    return new ApiResultDto<InfinityPagedDto<ChatMessageDto>>({
      data: new InfinityPagedDto<ChatMessageDto>({
        items: messages.items.map(message => ChatMessageDto.fromEntity(message)),
        hasNext: messages.hasNext,
        hasPrev: messages.hasPrev,
      })
    });
  }

  @Post(":channelId/messages")
  @ApiOkResponse({ type: () => withApiResult(ChatMessageDto) })
  async createMessage(
    @Param("channelId") channelId: string, @Body() body: ChatMessageDto, @ReqCredential() credential: ArenaWebCredential
  ): Promise<ApiResultDto<ChatMessageDto>> {
    const chatMessage = await this.chatService.createMessage(channelId, body, credential.user!);

    return new ApiResultDto<ChatMessageDto>({ data: ChatMessageDto.fromEntity(chatMessage) });
  }

  @Patch(":channelId/messages/:messageId")
  updateMessage(): string {
    return "Chat updated";
  }

  @Delete(":channelId/messages/:messageId")
  deleteMessage(): string {
    return "Chat deleted";
  }
}