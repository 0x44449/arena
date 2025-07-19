import api from "./api.axios";
import { CreateTeamDto, TeamDto } from "./generated";
import { ApiResult } from "./models/api-result";

async function getTeams() {
  const response = await api.get<ApiResult<TeamDto[]>>('/api/v1/teams');
  return response.data;
}

async function createTeam(data: CreateTeamDto) {
  const response = await api.post<ApiResult<TeamDto>>('/api/v1/teams', data);
  return response.data;
}

const teamApi = {
  getTeams,
  createTeam,
};
export default teamApi;