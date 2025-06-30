import api from "@/lib/api";
import ApiResult from "@/types/api-result.dto";
import TeamDto from "@/types/team.dto";

export async function getTeams(): Promise<ApiResult<TeamDto[]>> {
  const response = await api.get<ApiResult<TeamDto[]>>(`/api/v1/teams`);
  return response.data;
}

export async function getTeamByTeamId(teamId: string): Promise<ApiResult<TeamDto | null>> {
  const response = await api.get<ApiResult<TeamDto | null>>(`/api/v1/teams/${teamId}`);
  return response.data;
}

export interface CreateTeamParam {
  name: string;
  description?: string;
}

export async function createTeam(param: CreateTeamParam): Promise<ApiResult<TeamDto>> {
  const response = await api.post<ApiResult<TeamDto>>(`/api/v1/teams`, param);
  return response.data;
}

const teamApi = {
  getTeams,
  getTeamByTeamId,
  createTeam,
};
export default teamApi;