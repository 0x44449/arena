import { Controller, Get, Param, UseGuards } from "@nestjs/common";
import { plainToInstance } from "class-transformer";
import { ChatService } from "./chat.service";
import { ApiOkResponseWithResult } from "@/common/decorator/api-ok-response-with-result";
import { ApiResult } from "@/dto/api-result.dto";
import { ChatMessageDto } from "@/dto/chat-message.dto";
import { AuthGuard } from "@/auth/auth.guard";

@Controller('api/v1/chat')
@UseGuards(AuthGuard)
export class ChatController {
  constructor(private readonly chatService: ChatService) { }

  @Get('/:featureId/messages')
  @ApiOkResponseWithResult(ChatMessageDto, { isArray: true })
  async getMessages(@Param('featureId') featureId: string): Promise<ApiResult<ChatMessageDto[]>> {
    const messages = await this.chatService.getMessages(featureId);

    const result = new ApiResult<ChatMessageDto[]>({ data: messages });
    return plainToInstance(ApiResult<ChatMessageDto[]>, result);
  }
}