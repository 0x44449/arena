import { Controller, Delete, Get, Patch, Post } from "@nestjs/common";

@Controller("api/v1/teams")
export class TeamController {
  @Get(":teamId")
  getTeam(): string {
    return "Team details";
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