import ArenaCredential from "@/commons/arena-credential";
import { ApiOkResponseWith } from "@/decorators/api-ok-response-with.decorator";
import ReqCred from "@/decorators/req-cred.decorator";
import { ApiResultDto } from "@/dtos/api-result.dto";
import { TeamDto } from "@/dtos/team.dto";
import { AuthGuard } from "@/guards/auth.guard";
import { Body, Controller, Get, Param, Post, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiBody } from "@nestjs/swagger";
import { CreateTeamDto } from "./dtos/create-team.dto";
import { TeamsService } from "./teams.service";
import { ChannelDto } from "@/dtos/channel.dto";

@Controller('api/v1/teams')
@UseGuards(AuthGuard)
@ApiBearerAuth('access-token')
export class TeamsController {
  constructor(
    private readonly teamsService: TeamsService,
  ) {}

  @Post('')
  @ApiOkResponseWith(TeamDto)
  @ApiBody({ type: CreateTeamDto })
  async createTeam(@Body() dto: CreateTeamDto, @ReqCred() credential: ArenaCredential): Promise<ApiResultDto<TeamDto>> {
    const team = await this.teamsService.createTeam(dto, credential.user);

    return new ApiResultDto<TeamDto>({ data: TeamDto.fromEntity(team) });
  }

  @Get('')
  @ApiOkResponseWith(TeamDto, { isArray: true })
  async getTeams(@ReqCred() credential: ArenaCredential): Promise<ApiResultDto<TeamDto[]>> {
    const teams = await this.teamsService.findTeamsByUserId(credential.user.userId);

    const result = new ApiResultDto<TeamDto[]>({
      data: teams.map(team => TeamDto.fromEntity(team)),
    });
    return result;
  }

  @Get(':teamId')
  @ApiOkResponseWith(TeamDto)
  async getTeamById(@Param('teamId') teamId: string): Promise<ApiResultDto<TeamDto>> {
    const team = await this.teamsService.findTeamByTeamId(teamId);

    return new ApiResultDto<TeamDto>({ data: TeamDto.fromEntity(team) });
  }

  @Get(':teamId/channels')
  @ApiOkResponseWith(ChannelDto, { isArray: true })
  async getChannelsByTeamId(@Param('teamId') teamId: string): Promise<ApiResultDto<ChannelDto[]>> {
    const channels = await this.teamsService.findChannelsByTeamId(teamId);

    const result = new ApiResultDto<ChannelDto[]>({
      data: channels.map(channel => ChannelDto.fromEntity(channel)),
    });
    return result;
  }
}