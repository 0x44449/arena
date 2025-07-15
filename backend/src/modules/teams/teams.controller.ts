import ArenaCredential from "@/commons/arena-credential";
import { ApiOkResponseWith } from "@/decorators/api-ok-response-with.decorator";
import ReqCred from "@/decorators/req-cred.decorator";
import { ApiResult } from "@/dtos/api-result.dto";
import { TeamDto } from "@/dtos/team.dto";
import { AuthGuard } from "@/guards/auth.guard";
import { Body, Controller, Get, Param, Post, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiBody } from "@nestjs/swagger";
import { CreateTeamDto } from "./dto/create-team.dto";
import { TeamsService } from "./teams.service";
import { WorkspaceDto } from "@/dtos/workspace.dto";

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
  async createTeam(@Body() dto: CreateTeamDto, @ReqCred() credential: ArenaCredential): Promise<ApiResult<TeamDto>> {
    const team = await this.teamsService.createTeam(dto, credential.user);

    return new ApiResult<TeamDto>({ data: TeamDto.fromEntity(team) });
  }

  @Get('')
  @ApiOkResponseWith(TeamDto, { isArray: true })
  async getTeams(@ReqCred() credential: ArenaCredential): Promise<ApiResult<TeamDto[]>> {
    const teams = await this.teamsService.findTeamsByUserId(credential.user.userId);

    const result = new ApiResult<TeamDto[]>({
      data: teams.map(team => TeamDto.fromEntity(team)),
    });
    return result;
  }

  @Get(':teamId')
  @ApiOkResponseWith(TeamDto)
  async getTeamById(@Param('teamId') teamId: string): Promise<ApiResult<TeamDto>> {
    const team = await this.teamsService.findTeamByTeamId(teamId);

    return new ApiResult<TeamDto>({ data: TeamDto.fromEntity(team) });
  }

  @Get(':teamId/workspaces')
  @ApiOkResponseWith(WorkspaceDto, { isArray: true })
  async getWorkspacesByTeamId(@Param('teamId') teamId: string): Promise<ApiResult<WorkspaceDto[]>> {
    const workspaces = await this.teamsService.findWorkspacesByTeamId(teamId);

    const result = new ApiResult<WorkspaceDto[]>({
      data: workspaces.map(workspace => WorkspaceDto.fromEntity(workspace)),
    });
    return result;
  }
}