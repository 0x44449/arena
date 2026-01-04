import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UseGuards,
} from "@nestjs/common";
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiTags } from "@nestjs/swagger";
import { ArenaJwtAuthGuard } from "src/guards/arena-jwt-auth-guard";
import { CurrentUser } from "src/decorators/current-user.decorator";
import { CreateDirectChannelDto } from "./dtos/create-direct-channel.dto";
import { CreateGroupChannelDto } from "./dtos/create-group-channel.dto";
import { ChannelService } from "./channel.service";
import { DirectChannelService } from "./direct-channel.service";
import { GroupChannelService } from "./group-channel.service";
import { UserService } from "../user/user.service";
import { S3Service } from "../file/s3.service";
import { toChannelDto } from "src/utils/channel.mapper";
import { toParticipantDto } from "src/utils/participant.mapper";
import { toUserDto } from "src/utils/user.mapper";
import { toFileDto } from "src/utils/file.mapper";
import { ChannelDto } from "src/dtos/channel.dto";
import { withSingleApiResult, type SingleApiResultDto } from "src/dtos/single-api-result.dto";
import { withListApiResult, type ListApiResultDto } from "src/dtos/list-api-result.dto";
import type { JwtPayload } from "src/types/jwt-payload.interface";
import type { ParticipantDto } from "src/dtos/participant.dto";

@ApiTags("channels")
@Controller("/api/v1/channels")
@UseGuards(ArenaJwtAuthGuard)
@ApiBearerAuth()
export class ChannelController {
  constructor(
    private readonly channelService: ChannelService,
    private readonly directChannelService: DirectChannelService,
    private readonly groupChannelService: GroupChannelService,
    private readonly userService: UserService,
    private readonly s3Service: S3Service,
  ) {}

  // ===== 생성 (타입별 분리) =====

  @Post("direct")
  @ApiOperation({ summary: "DM 생성 (이미 있으면 기존 반환)" })
  @ApiOkResponse({ type: () => withSingleApiResult(ChannelDto) })
  async createDirectChannel(
    @CurrentUser() jwt: JwtPayload,
    @Body() dto: CreateDirectChannelDto,
  ): Promise<SingleApiResultDto<ChannelDto>> {
    const user = await this.userService.getByUid(jwt.uid);

    const { channel, participants } = await this.directChannelService.getOrCreate(
      user.userId,
      dto.userId,
    );

    const participantDtos: ParticipantDto[] = [];
    for (const p of participants) {
      const avatar = p.user.avatar
        ? await toFileDto(p.user.avatar, this.s3Service)
        : null;
      const userDto = toUserDto(p.user, avatar);
      participantDtos.push(toParticipantDto(p, userDto));
    }

    return {
      success: true,
      data: toChannelDto(channel, null, participantDtos),
      errorCode: null,
    };
  }

  @Post("group")
  @ApiOperation({ summary: "그룹 채널 생성" })
  @ApiOkResponse({ type: () => withSingleApiResult(ChannelDto) })
  async createGroupChannel(
    @CurrentUser() jwt: JwtPayload,
    @Body() dto: CreateGroupChannelDto,
  ): Promise<SingleApiResultDto<ChannelDto>> {
    const user = await this.userService.getByUid(jwt.uid);

    const { channel, groupChannel, participants } = await this.groupChannelService.create(
      user.userId,
      dto.name,
      dto.userIds ?? [],
      dto.iconFileId ?? null,
    );

    const participantDtos: ParticipantDto[] = [];
    for (const p of participants) {
      const avatar = p.user.avatar
        ? await toFileDto(p.user.avatar, this.s3Service)
        : null;
      const userDto = toUserDto(p.user, avatar);
      participantDtos.push(toParticipantDto(p, userDto));
    }

    const icon = groupChannel.icon
      ? await toFileDto(groupChannel.icon, this.s3Service)
      : null;

    return {
      success: true,
      data: toChannelDto(channel, icon, participantDtos),
      errorCode: null,
    };
  }

  // ===== 조회 (통합) =====

  @Get()
  @ApiOperation({ summary: "내 채널 목록" })
  @ApiOkResponse({ type: () => withListApiResult(ChannelDto) })
  async getMyChannels(@CurrentUser() jwt: JwtPayload): Promise<ListApiResultDto<ChannelDto>> {
    const user = await this.userService.getByUid(jwt.uid);

    const results = await this.channelService.getMyChannels(user.userId);

    const dtos: ChannelDto[] = [];
    for (const details of results) {
      const participantDtos: ParticipantDto[] = [];
      for (const p of details.participants) {
        const avatar = p.user.avatar
          ? await toFileDto(p.user.avatar, this.s3Service)
          : null;
        const userDto = toUserDto(p.user, avatar);
        participantDtos.push(toParticipantDto(p, userDto));
      }

      const icon = details.groupChannel?.icon
        ? await toFileDto(details.groupChannel.icon, this.s3Service)
        : null;

      dtos.push(toChannelDto(details.channel, icon, participantDtos));
    }

    return {
      success: true,
      data: dtos,
      errorCode: null,
    };
  }

  @Get(":channelId")
  @ApiOperation({ summary: "채널 상세 조회" })
  @ApiOkResponse({ type: () => withSingleApiResult(ChannelDto) })
  async getChannel(
    @CurrentUser() jwt: JwtPayload,
    @Param("channelId") channelId: string,
  ): Promise<SingleApiResultDto<ChannelDto>> {
    const user = await this.userService.getByUid(jwt.uid);

    const details = await this.channelService.getChannel(channelId, user.userId);

    const participantDtos: ParticipantDto[] = [];
    for (const p of details.participants) {
      const avatar = p.user.avatar
        ? await toFileDto(p.user.avatar, this.s3Service)
        : null;
      const userDto = toUserDto(p.user, avatar);
      participantDtos.push(toParticipantDto(p, userDto));
    }

    const icon = details.groupChannel?.icon
      ? await toFileDto(details.groupChannel.icon, this.s3Service)
      : null;

    return {
      success: true,
      data: toChannelDto(details.channel, icon, participantDtos),
      errorCode: null,
    };
  }
}
