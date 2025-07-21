import api from "./api.axios";
import { CreateWorkspaceDto, WorkspaceDto } from "./generated";
import { ApiResult } from "./models/api-result";

async function getWorkspacesByTeamId(teamId: string) {
  const response = await api.get<ApiResult<WorkspaceDto[]>>(`/api/v1/teams/${teamId}/workspaces`);
  return response.data;
}

async function createWorkspace(param: CreateWorkspaceDto) {
  const response = await api.post<ApiResult<WorkspaceDto>>(`/api/v1/workspaces`, param);
  return response.data;
}

const workspaceApi = {
  getWorkspacesByTeamId,
  createWorkspace,
}
export default workspaceApi;