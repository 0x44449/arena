import { ApiResultDto, withApiResult } from "@/dtos/api-result.dto";
import { ChannelDto } from "@/dtos/channel.dto";
import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from "@nestjs/common";
import { ApiOkResponse } from "@nestjs/swagger";
import { ChannelService } from "./channel.service";
import { WellKnownError } from "@/exceptions/well-known-error";
import { ArenaWebAuthGuard } from "@/auth/arena-web-auth-guard";
import { CreateChannelDto } from "./dtos/create-channel.dto";
import ReqCredential from "@/auth/arena-credential.decorator";
import type ArenaWebCredential from "@/auth/arena-web-credential";
import { UpdateChannelDto } from "./dtos/update-channel.dto";

@Controller("api/v1/channels")
@UseGuards(ArenaWebAuthGuard)
export class ChannelController {
  constructor(
    private readonly channelService: ChannelService,
  ) {}

  @Get(":channelId")
  @ApiOkResponse({ type: () => withApiResult(ChannelDto)})
  async getChannel(@Param("channelId") channelId: string): Promise<ApiResultDto<ChannelDto>> {
    const channel = await this.channelService.findChannelById(channelId);
    if (!channel) {
      throw new WellKnownError({
        message: "Channel not found",
        errorCode: "CHANNEL_NOT_FOUND",
      });
    }

    return new ApiResultDto<ChannelDto>({ data: ChannelDto.fromEntity(channel) });
  }

  @Post()
  @ApiOkResponse({ type: () => withApiResult(ChannelDto) })
  async createChannel(@Body() body: CreateChannelDto, @ReqCredential() credential: ArenaWebCredential): Promise<ApiResultDto<ChannelDto>> {
    const channel = await this.channelService.createChannel({
      name: body.name,
      description: body.description || "",
      teamId: body.teamId,
      ownerId: credential.user!.userId,
    });

    return new ApiResultDto<ChannelDto>({ data: ChannelDto.fromEntity(channel) });
  }

  @Patch(":channelId")
  @ApiOkResponse({ type: () => withApiResult(ChannelDto) })
  async updateChannel(@Param("channelId") channelId: string, @Body() body: UpdateChannelDto, @ReqCredential() credential: ArenaWebCredential): Promise<ApiResultDto<ChannelDto>> {
    const channel = await this.channelService.updateChannel(channelId, body, credential.user!);

    return new ApiResultDto<ChannelDto>({ data: ChannelDto.fromEntity(channel) });
  }

  @Delete(":channelId")
  @ApiOkResponse({ type: () => withApiResult(Object) })
  async deleteChannel(@Param("channelId") channelId: string, @ReqCredential() credential: ArenaWebCredential): Promise<ApiResultDto<null>> {
    await this.channelService.deleteChannel(channelId, credential.user!);

    return new ApiResultDto<null>({ data: null });
  }
}