import { ApiResultDto, withApiResult } from "@/dtos/api-result.dto";
import { TeamDto } from "@/dtos/team.dto";
import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from "@nestjs/common";
import { ApiOkResponse } from "@nestjs/swagger";
import { TeamService } from "./team.service";
import { WellKnownError } from "@/exceptions/well-known-error";
import { CreateTeamDto } from "./dtos/create-team.dto";
import ReqCredential from "@/auth/arena-credential.decorator";
import type ArenaWebCredential from "@/auth/arena-web-credential";
import { UpdateTeamDto } from "./dtos/update-team.dto";
import { ArenaWebAuthGuard } from "@/auth/arena-web-auth-guard";

@Controller("api/v1/teams")
@UseGuards(ArenaWebAuthGuard)
export class TeamController {
  constructor(
    private readonly teamService: TeamService,
  ) {}

  @Get(":teamId")
  @ApiOkResponse({ type: () => withApiResult(TeamDto) })
  async getTeam(@Param("teamId") teamId: string): Promise<ApiResultDto<TeamDto>> {
    const team = await this.teamService.findTeamById(teamId);
    if (!team) {
      throw new WellKnownError({
        message: "Team not found",
        errorCode: "TEAM_NOT_FOUND",
      });
    }

    return new ApiResultDto<TeamDto>({ data: TeamDto.fromEntity(team) });
  }

  @Post()
  @ApiOkResponse({ type: () => withApiResult(TeamDto) })
  async createTeam(@Body() body: CreateTeamDto, @ReqCredential() credential: ArenaWebCredential): Promise<ApiResultDto<TeamDto>> {
    const team = await this.teamService.createTeam({
      name: body.name,
      description: body.description || "",
      ownerId: credential.user!.userId,
    });
    
    return new ApiResultDto<TeamDto>({ data: TeamDto.fromEntity(team) });
  }

  @Patch(":teamId")
  @ApiOkResponse({ type: () => withApiResult(TeamDto) })
  async updateTeam(@Param("teamId") teamId: string, @Body() body: UpdateTeamDto, @ReqCredential() credential: ArenaWebCredential): Promise<ApiResultDto<TeamDto>> {
    const team = await this.teamService.updateTeam(teamId, body, credential.user!);

    return new ApiResultDto<TeamDto>({ data: TeamDto.fromEntity(team) });
  }

  @Delete(":teamId")
  @ApiOkResponse({ type: () => withApiResult(Object) })
  async deleteTeam(@Param("teamId") teamId: string, @ReqCredential() credential: ArenaWebCredential): Promise<ApiResultDto<null>> {
    await this.teamService.deleteTeam(teamId, credential.user!);
    
    return new ApiResultDto<null>({ data: null });
  }

  @Get(":teamId/channels")
  getTeamChannels(): string {
    return "List of team channels";
  }
}