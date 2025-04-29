import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from "@nestjs/common";
import { TeamService } from "./team.service";
import { WorkspaceService } from "@/workspace/workspace.service";
import { ApiOkResponseWithResult } from "@/common/decorator/api-ok-response-with-result";
import { TeamDto } from "@/dto/team.dto";
import { ApiBody } from "@nestjs/swagger";
import { CreateTeamDto } from "./dto/create-team.dto";
import { ApiResult } from "@/dto/api-result.dto";
import { plainToInstance } from "class-transformer";
import { UpdateTeamDto } from "./dto/update-team.dto";
import { WorkspaceDto } from "@/dto/workspace.dto";
import { CreateWorkspaceDto } from "@/workspace/dto/create-workspace.dto";
import { AuthGuard } from "@/auth/auth.guard";
import { User } from "@/auth/user.decorator";
import { UserEntity } from "@/entity/user.entity";

@Controller('api/v1/team')
@UseGuards(AuthGuard)
export class TeamController {
  constructor(
    private readonly teamService: TeamService,
    private readonly workspaceService: WorkspaceService,
  ) {}

  @Post()
  @ApiOkResponseWithResult(TeamDto)
  @ApiBody({ type: CreateTeamDto })
  async createTeam(@Body() param: CreateTeamDto, @User() user: UserEntity): Promise<ApiResult<TeamDto>> {
    const team = await this.teamService.createTeam(param, user.userId);

    const result = new ApiResult<TeamDto>({ data: team });
    return plainToInstance(ApiResult<TeamDto>, result);
  }

  @Put(':teamId')
  @ApiOkResponseWithResult(TeamDto)
  @ApiBody({ type: UpdateTeamDto })
  async updateTeam(
    @Param('teamId') teamId: string, @Body() param: UpdateTeamDto, @User() user: UserEntity
  ): Promise<ApiResult<TeamDto | null>> {
    const team = await this.teamService.updateTeam(teamId, param, 'admin');

    const result = new ApiResult<TeamDto | null>({ data: team ? team : null });
    return plainToInstance(ApiResult<TeamDto | null>, result);
  }

  @Delete(':teamId')
  @ApiOkResponseWithResult()
  async deleteTeam(@Param('teamId') teamId: string, @User() user: UserEntity): Promise<ApiResult<null>> {
    await this.teamService.deleteTeam(teamId, 'admin');

    const result = new ApiResult<null>({ data: null });
    return plainToInstance(ApiResult<null>, result);
  }

  @Get()
  @ApiOkResponseWithResult(TeamDto, { isArray: true })
  async getTeams(@User() user: UserEntity): Promise<ApiResult<TeamDto[]>> {
    const teams = await this.teamService.getTeams();

    const result = new ApiResult<TeamDto[]>({ data: teams });
    return plainToInstance(ApiResult<TeamDto[]>, result);
  }

  @Get(':teamId')
  @ApiOkResponseWithResult(TeamDto)
  async getTeam(@Param('teamId') teamId: string, @User() user: UserEntity): Promise<ApiResult<TeamDto | null>> {
    const team = await this.teamService.getTeamByTeamId(teamId);

    const result = new ApiResult<TeamDto | null>({ data: team ? team : null });
    return plainToInstance(ApiResult<TeamDto | null>, result);
  }

  @Post(':teamId/workspaces')
  @ApiOkResponseWithResult(WorkspaceDto)
  @ApiBody({ type: CreateWorkspaceDto })
  async createWorkspace(
    @Param('teamId') teamId: string, @Body() param: CreateWorkspaceDto, @User() user: UserEntity
  ): Promise<ApiResult<WorkspaceDto>> {
    const workspace = await this.workspaceService.createWorkspace(param, teamId, 'admin');

    const result = new ApiResult<WorkspaceDto>({ data: workspace });
    return plainToInstance(ApiResult<WorkspaceDto>, result);
  }

  @Get(':teamId/workspaces')
  @ApiOkResponseWithResult(WorkspaceDto, { isArray: true })
  async getWorkspaces(@Param('teamId') teamId: string, @User() user: UserEntity): Promise<ApiResult<WorkspaceDto[]>> {
    const workspaces = await this.workspaceService.getWorkspacesByTeamId(teamId);

    const result = new ApiResult<WorkspaceDto[]>({ data: workspaces });
    return plainToInstance(ApiResult<WorkspaceDto[]>, result);
  }
}