import { Body, Controller, Get, Param, Post, UploadedFile, UseGuards, UseInterceptors } from "@nestjs/common";
import { plainToInstance } from "class-transformer";
import { ChatService } from "./chat.service";
import { ApiOkResponseWithResult } from "@/common/decorator/api-ok-response-with-result";
import { ApiResult } from "@/dto/api-result.dto";
import { ChatMessageDto } from "@/dto/chat-message.dto";
import { AuthGuard } from "@/auth/auth.guard";
import { ApiBearerAuth, ApiBody } from "@nestjs/swagger";
import { FromCredential } from "@/auth/credential.decorator";
import ArenaCredential from "@/auth/arena-credential";
import { CreateTextChatMessageDto } from "./dto/create-text-chat-message.dto";
import { CreateImageChatMessageDto } from "./dto/create-image-chat-message.dto";
import { FileInterceptor } from "@nestjs/platform-express";
import { memoryStorage } from "multer";

@Controller('api/v1/chat')
@UseGuards(AuthGuard)
@ApiBearerAuth('access-token')
export class ChatController {
  constructor(private readonly chatService: ChatService) { }

  @Get('/:featureId/messages')
  @ApiOkResponseWithResult(ChatMessageDto, { isArray: true })
  async getMessages(@Param('featureId') featureId: string): Promise<ApiResult<ChatMessageDto[]>> {
    const messages = await this.chatService.getMessages(featureId);

    const result = new ApiResult<ChatMessageDto[]>({ data: messages });
    return plainToInstance(ApiResult<ChatMessageDto[]>, result);
  }

  @Post('/:featureId/messages/text')
  @ApiOkResponseWithResult(ChatMessageDto)
  @ApiBody({ type: CreateTextChatMessageDto })
  async createTextMessage(
    @Param('featureId') featureId: string,
    @Body() param: CreateTextChatMessageDto,
    @FromCredential() credential: ArenaCredential
  ): Promise<ApiResult<ChatMessageDto>> {
    const message = await this.chatService.createTextMessage(featureId, param, credential.userId);
    return plainToInstance(ApiResult<ChatMessageDto>, { data: message });
  }

  @Post('/:featureId/messages/image')
  @UseInterceptors(FileInterceptor('file', {
    storage: memoryStorage(),
    limits: { fileSize: 100 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
      if (!file.mimetype.startsWith('image/')) return cb(new Error('image only'), false);
      cb(null, true);
    },
  }))
  @ApiOkResponseWithResult(ChatMessageDto)
  @ApiBody({ type: CreateImageChatMessageDto })
  async createImageMessage(
    @Param('featureId') featureId: string,
    @Body() param: CreateImageChatMessageDto,
    @UploadedFile() file: Express.Multer.File,
    @FromCredential() credential: ArenaCredential
  ): Promise<ApiResult<ChatMessageDto>> {
    const message = await this.chatService.createImageMessage(featureId, param, file, credential.userId);
    return plainToInstance(ApiResult<ChatMessageDto>, { data: message });
  }
}