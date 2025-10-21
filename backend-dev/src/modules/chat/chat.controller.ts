import type ArenaWebCredential from "@/auth/web/arena-web-credential";
import ReqCredential from "@/auth/web/arena-web-credential.decorator";
import { ApiResultDto, withApiResult } from "@/dtos/api-result.dto";
import { ChatMessageDto } from "@/dtos/chat-message.dto";
import { Body, Controller, Delete, Get, Param, Patch, Post } from "@nestjs/common";
import { ApiOkResponse } from "@nestjs/swagger";
import { ChatService } from "./chat.service";

@Controller("api/v1/chat")
export class ChatController {
  constructor(
    private readonly chatService: ChatService,
  ) {}

  @Get(":channelId/messages")
  getChats(): string {
    return "List of chats";
  }

  @Post(":channelId/messages")
  @ApiOkResponse({ type: () => withApiResult(ChatMessageDto) })
  async createChatMessage(@Param("channelId") channelId: string, @Body() body: ChatMessageDto, @ReqCredential() credential: ArenaWebCredential): Promise<ApiResultDto<ChatMessageDto>> {
    const chatMessage = await this.chatService.createMessage(channelId, body, credential.user!);

    return new ApiResultDto<ChatMessageDto>({ data: ChatMessageDto.fromEntity(chatMessage) });
  }

  @Patch(":channelId/messages/:messageId")
  updateChat(): string {
    return "Chat updated";
  }

  @Delete(":channelId/messages/:messageId")
  deleteChat(): string {
    return "Chat deleted";
  }
}