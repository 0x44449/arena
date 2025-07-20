import api from "./api.axios";
import { WorkspaceDto } from "./generated";
import { ApiResult } from "./models/api-result";

async function getWorkspacesByTeamId(teamId: string) {
  const response = await api.get<ApiResult<WorkspaceDto[]>>(`/api/v1/teams/${teamId}/workspaces`);
  return response.data;
}

const workspaceApi = {
  getWorkspacesByTeamId,
}
export default workspaceApi;