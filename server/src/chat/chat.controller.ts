import { Body, Controller, Get, Param, Post, UploadedFiles, UseGuards, UseInterceptors } from "@nestjs/common";
import { plainToInstance } from "class-transformer";
import { ChatService } from "./chat.service";
import { ApiOkResponseWithResult } from "@/common/decorator/api-ok-response-with-result";
import { ApiResult } from "@/dto/api-result.dto";
import { ChatMessageDto } from "@/dto/chat-message.dto";
import { AuthGuard } from "@/auth/auth.guard";
import { ApiBearerAuth, ApiConsumes, ApiBody } from "@nestjs/swagger";
import { FromCredential } from "@/auth/credential.decorator";
import ArenaCredential from "@/auth/arena-credential";
import { FilesInterceptor } from "@nestjs/platform-express";
import { diskStorage } from "multer";
import { CreateChatMessageDto } from "./dto/create-chat-message.dto";
import { randomUUID } from "crypto";
import { ChatAttachmentDto } from "@/dto/chat-attachment.dto";

@Controller('api/v1/chat')
@UseGuards(AuthGuard)
@ApiBearerAuth('access-token')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Get('/:featureId/messages')
  @ApiOkResponseWithResult(ChatMessageDto, { isArray: true })
  async getMessages(@Param('featureId') featureId: string): Promise<ApiResult<ChatMessageDto[]>> {
    const messages = await this.chatService.getMessages(featureId);

    const result = new ApiResult<ChatMessageDto[]>({ data: messages });
    return plainToInstance(ApiResult<ChatMessageDto[]>, result);
  }

  @Post('/:featureId/messages')
  @ApiOkResponseWithResult(ChatMessageDto)
  async createMessage(@Param('featureId') featureId: string, @Body() param: CreateChatMessageDto, @FromCredential() credential: ArenaCredential): Promise<ApiResult<ChatMessageDto>> {
    const message = await this.chatService.createMessage(featureId, param, credential.userId);
    return plainToInstance(ApiResult<ChatMessageDto>, { data: message });
  }

  @Post('/:featureId/messages/attachments')
  @ApiOkResponseWithResult(ChatAttachmentDto, { isArray: true })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        files: {
          type: 'array',
          items: {
            type: 'string',
            format: 'binary'
          }
        }
      }
    }
  })
  @UseInterceptors(FilesInterceptor('files', 10, {
    limits: {
      fileSize: 100 * 1024 * 1024, // 최대 100MB 파일 크기
    },
    storage: diskStorage({
      destination: (req, file, cb) => {
        const destinationDir = `${process.env.FILE_STORAGE_LOCATION}`;
        cb(null, destinationDir); // 업로드 디렉토리 설정
      },
      filename: (req, file, cb) => {
        const fileName = randomUUID();
        cb(null, `${fileName}`);
      }
    })
  }))
  async uploadAttachments(
    @Param('featureId') featureId: string,
    @UploadedFiles() files: Express.Multer.File[],
    @FromCredential() credential: ArenaCredential
  ): Promise<ApiResult<ChatAttachmentDto[]>> {
    const attachmentUrls = await this.chatService.uploadAttachments(featureId, files, credential.userId);
    return plainToInstance(ApiResult<ChatAttachmentDto[]>, { data: attachmentUrls });
  }
}