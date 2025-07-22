import api from "./api.axios";
import { CreateTeamDto, TeamDto } from "./generated";
import { ApiResultDto } from "./models/api-result";

async function getTeams() {
  const response = await api.get<ApiResultDto<TeamDto[]>>('/api/v1/teams');
  return response.data;
}

async function createTeam(data: CreateTeamDto) {
  const response = await api.post<ApiResultDto<TeamDto>>('/api/v1/teams', data);
  return response.data;
}

async function getTeamByTeamId(teamId: string) {
  const response = await api.get<ApiResultDto<TeamDto>>(`/api/v1/teams/${teamId}`);
  return response.data;
}

const teamApi = {
  getTeams,
  createTeam,
  getTeamByTeamId,
};
export default teamApi;