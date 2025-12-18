import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from "@nestjs/common";
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiTags } from "@nestjs/swagger";
import { ArenaJwtAuthGuard } from "src/guards/arena-jwt-auth-guard";
import { CurrentUser } from "src/decorators/current-user.decorator";
import { MessageDto } from "src/dtos/message.dto";
import { withSingleApiResult, type SingleApiResultDto } from "src/dtos/single-api-result.dto";
import {
  withInfinityListApiResult,
  type InfinityListApiResultDto,
} from "src/dtos/infinity-list-api-result.dto";
import { CreateMessageDto } from "./dtos/create-message.dto";
import { GetMessagesQueryDto } from "./dtos/get-messages-query.dto";
import { MessageService } from "./message.service";
import { UserService } from "../user/user.service";
import { S3Service } from "../file/s3.service";
import { toMessageDto } from "src/utils/message.mapper";
import { toUserDto } from "src/utils/user.mapper";
import { toFileDto } from "src/utils/file.mapper";
import { WellKnownException } from "src/exceptions/well-known-exception";
import type { JwtPayload } from "src/types/jwt-payload.interface";

@ApiTags("messages")
@Controller("/api/v1/messages")
@UseGuards(ArenaJwtAuthGuard)
@ApiBearerAuth()
export class MessageController {
  constructor(
    private readonly messageService: MessageService,
    private readonly userService: UserService,
    private readonly s3Service: S3Service,
  ) {}

  @Post("channel/:channelId")
  @ApiOperation({ summary: "메시지 보내기" })
  @ApiOkResponse({ type: () => withSingleApiResult(MessageDto) })
  async createMessage(
    @CurrentUser() jwt: JwtPayload,
    @Param("channelId") channelId: string,
    @Body() dto: CreateMessageDto,
  ): Promise<SingleApiResultDto<MessageDto>> {
    const user = await this.userService.findByUid(jwt.uid);
    if (!user) {
      throw new WellKnownException({
        message: "User not found",
        errorCode: "USER_NOT_FOUND",
      });
    }

    const message = await this.messageService.createMessage(
      user.userId,
      channelId,
      dto.content,
    );

    const avatar = message.sender.avatar
      ? await toFileDto(message.sender.avatar, this.s3Service)
      : null;
    const senderDto = toUserDto(message.sender, avatar);

    return {
      success: true,
      data: toMessageDto(message, senderDto),
      errorCode: null,
    };
  }

  @Get("channel/:channelId")
  @ApiOperation({ summary: "메시지 목록 조회" })
  @ApiOkResponse({ type: () => withInfinityListApiResult(MessageDto) })
  async getMessages(
    @CurrentUser() jwt: JwtPayload,
    @Param("channelId") channelId: string,
    @Query() query: GetMessagesQueryDto,
  ): Promise<InfinityListApiResultDto<MessageDto>> {
    const user = await this.userService.findByUid(jwt.uid);
    if (!user) {
      throw new WellKnownException({
        message: "User not found",
        errorCode: "USER_NOT_FOUND",
      });
    }

    const result = await this.messageService.getMessages(user.userId, channelId, {
      before: query.before,
      after: query.after,
      around: query.around,
      limit: query.limit,
    });

    const messageDtos: MessageDto[] = [];
    for (const message of result.messages) {
      const avatar = message.sender.avatar
        ? await toFileDto(message.sender.avatar, this.s3Service)
        : null;
      const senderDto = toUserDto(message.sender, avatar);
      messageDtos.push(toMessageDto(message, senderDto));
    }

    return {
      success: true,
      data: messageDtos,
      hasNext: result.hasNext,
      hasPrev: result.hasPrev,
      errorCode: null,
    };
  }
}
