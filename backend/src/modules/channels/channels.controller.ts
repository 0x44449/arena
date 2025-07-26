import { Body, Controller, Get, Param, Post, UseGuards } from "@nestjs/common";
import { ChannelsService } from "./channels.service";
import { AuthGuard } from "@/guards/auth.guard";
import { ApiBearerAuth, ApiBody } from "@nestjs/swagger";
import { ApiOkResponseWith } from "@/decorators/api-ok-response-with.decorator";
import { CreateChannelDto } from "./dtos/create-channel.dto";
import { ChannelDto } from "@/dtos/channel.dto";
import ReqCred from "@/decorators/req-cred.decorator";
import ArenaCredential from "@/commons/arena-credential";
import { ApiResultDto } from "@/dtos/api-result.dto";

@Controller('api/v1/channels')
@UseGuards(AuthGuard)
@ApiBearerAuth('access-token')
export class ChannelsController {
  constructor(
    private readonly channelsService: ChannelsService,
  ) {}

  @Post('')
  @ApiOkResponseWith(ChannelDto)
  @ApiBody({ type: CreateChannelDto })
  async createChannel(@Body() dto: CreateChannelDto, @ReqCred() credential: ArenaCredential): Promise<ApiResultDto<ChannelDto>> {
    const channel = await this.channelsService.createChannel(dto, credential.user);

    return new ApiResultDto<ChannelDto>({ data: ChannelDto.fromEntity(channel) });
  }

  @Get(':channelId')
  @ApiOkResponseWith(ChannelDto)
  async getChannelByChannelId(@Param('channelId') channelId: string): Promise<ApiResultDto<ChannelDto>> {
    const channel = await this.channelsService.findChannelByChannelId(channelId);

    return new ApiResultDto<ChannelDto>({ data: ChannelDto.fromEntity(channel) });
  }
}