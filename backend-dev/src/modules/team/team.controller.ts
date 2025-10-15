import { ApiResultDto, withApiResult } from "@/dtos/api-result.dto";
import { TeamDto } from "@/dtos/team.dto";
import { Controller, Delete, Get, Param, Patch, Post } from "@nestjs/common";
import { ApiOkResponse } from "@nestjs/swagger";
import { TeamService } from "./team.service";
import { WellKnownError } from "@/exceptions/well-known-error";

@Controller("api/v1/teams")
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
  createTeam(): string {
    return "Team created";
  }

  @Patch(":teamId")
  updateTeam(): string {
    return "Team updated";
  }

  @Delete(":teamId")
  deleteTeam(): string {
    return "Team deleted";
  }

  @Get(":teamId/channels")
  getTeamChannels(): string {
    return "List of team channels";
  }
}