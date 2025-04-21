import { Controller, Get, Param } from "@nestjs/common";
import { plainToInstance } from "class-transformer";
import { ChatMessageDto } from "./dto/chat-message.dto";
import { ChatService } from "./chat.service";

@Controller('api/v1/chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) { }

  @Get('messages/:vaultId/:zoneId')
  async getMessages(@Param('vaultId') vaultId: string, @Param('zoneId') zoneId: string): Promise<ChatMessageDto[]> {
    const messages = await this.chatService.getMessages(vaultId, zoneId);

    return plainToInstance(ChatMessageDto, messages);
  }
}