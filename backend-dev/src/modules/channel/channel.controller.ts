import { ApiResultDto, withApiResult } from "@/dtos/api-result.dto";
import { ChannelDto } from "@/dtos/channel.dto";
import { Controller, Delete, Get, Param, Patch, Post, UseGuards } from "@nestjs/common";
import { ApiOkResponse } from "@nestjs/swagger";
import { ChannelService } from "./channel.service";
import { WellKnownError } from "@/exceptions/well-known-error";
import { ArenaWebAuthGuard } from "@/auth/arena-web-auth-guard";

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
  createChannel(): string {
    return "Channel created";
  }

  @Patch(":channelId")
  updateChannel(): string {
    return "Channel updated";
  }

  @Delete(":channelId")
  deleteChannel(): string {
    return "Channel deleted";
  }
}