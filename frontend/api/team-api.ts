import api from "./api.axios";
import { TeamDto } from "./generated";
import { ApiResult } from "./models/api-result";

async function getTeams() {
  const response = await api.get<ApiResult<TeamDto[]>>('/api/v1/teams');
  return response.data;
}

const teamApi = {
  getTeams,
};
export default teamApi;