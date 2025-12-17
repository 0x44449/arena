import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UseGuards,
} from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import { ArenaJwtAuthGuard } from "src/guards/arena-jwt-auth-guard";
import { CurrentUser } from "src/decorators/current-user.decorator";
import { CreateDirectChannelDto } from "./dtos/create-direct-channel.dto";
import { CreateGroupChannelDto } from "./dtos/create-group-channel.dto";
import { ChannelService, ChannelWithDetails } from "./channel.service";
import { DirectChannelService } from "./direct-channel.service";
import { GroupChannelService } from "./group-channel.service";
import { UserService } from "../user/user.service";
import { S3Service } from "../file/s3.service";
import { toChannelDto } from "src/utils/channel.mapper";
import { toParticipantDto } from "src/utils/participant.mapper";
import { toUserDto } from "src/utils/user.mapper";
import { toFileDto } from "src/utils/file.mapper";
import { WellKnownException } from "src/exceptions/well-known-exception";
import type { JwtPayload } from "src/types/jwt-payload.interface";
import type { ChannelDto } from "src/dtos/channel.dto";
import type { ParticipantDto } from "src/dtos/participant.dto";
import type { ParticipantEntity } from "src/entities/participant.entity";

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

  private async getUserIdFromJwt(jwt: JwtPayload): Promise<string> {
    const user = await this.userService.findByUid(jwt.uid);
    if (!user) {
      throw new WellKnownException({
        message: "User not found",
        errorCode: "USER_NOT_FOUND",
      });
    }
    return user.userId;
  }

  private async toParticipantDtos(
    participants: ParticipantEntity[],
  ): Promise<ParticipantDto[]> {
    const dtos: ParticipantDto[] = [];
    for (const p of participants) {
      const avatar = p.user.avatar
        ? await toFileDto(p.user.avatar, this.s3Service)
        : null;
      const userDto = toUserDto(p.user, avatar);
      dtos.push(toParticipantDto(p, userDto));
    }
    return dtos;
  }

  private async toChannelDtoFromDetails(
    details: ChannelWithDetails,
  ): Promise<ChannelDto> {
    const participantDtos = await this.toParticipantDtos(details.participants);

    // 그룹 채널이면 아이콘 변환
    const icon = details.groupChannel?.icon
      ? await toFileDto(details.groupChannel.icon, this.s3Service)
      : null;

    return toChannelDto(details.channel, icon, participantDtos);
  }

  // ===== 생성 (타입별 분리) =====

  @Post("direct")
  @ApiOperation({ summary: "DM 생성 (이미 있으면 기존 반환)" })
  async createDirectChannel(
    @CurrentUser() jwt: JwtPayload,
    @Body() dto: CreateDirectChannelDto,
  ): Promise<ChannelDto> {
    const userId = await this.getUserIdFromJwt(jwt);

    const { channel, participants } = await this.directChannelService.getOrCreate(
      userId,
      dto.userId,
    );

    const participantDtos = await this.toParticipantDtos(participants);
    return toChannelDto(channel, null, participantDtos);
  }

  @Post("group")
  @ApiOperation({ summary: "그룹 채널 생성" })
  async createGroupChannel(
    @CurrentUser() jwt: JwtPayload,
    @Body() dto: CreateGroupChannelDto,
  ): Promise<ChannelDto> {
    const userId = await this.getUserIdFromJwt(jwt);

    const { channel, groupChannel, participants } = await this.groupChannelService.create(
      userId,
      dto.name,
      dto.userIds ?? [],
      dto.iconFileId ?? null,
    );

    const participantDtos = await this.toParticipantDtos(participants);
    const icon = groupChannel.icon
      ? await toFileDto(groupChannel.icon, this.s3Service)
      : null;

    return toChannelDto(channel, icon, participantDtos);
  }

  // ===== 조회 (통합) =====

  @Get()
  @ApiOperation({ summary: "내 채널 목록" })
  async getMyChannels(@CurrentUser() jwt: JwtPayload): Promise<ChannelDto[]> {
    const userId = await this.getUserIdFromJwt(jwt);

    const results = await this.channelService.getMyChannels(userId);

    const dtos: ChannelDto[] = [];
    for (const details of results) {
      dtos.push(await this.toChannelDtoFromDetails(details));
    }

    return dtos;
  }

  @Get(":channelId")
  @ApiOperation({ summary: "채널 상세 조회" })
  async getChannel(
    @CurrentUser() jwt: JwtPayload,
    @Param("channelId") channelId: string,
  ): Promise<ChannelDto> {
    const userId = await this.getUserIdFromJwt(jwt);

    const details = await this.channelService.getChannel(channelId, userId);

    return this.toChannelDtoFromDetails(details);
  }
}
