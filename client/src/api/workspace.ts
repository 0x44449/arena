import api from "@/lib/api";
import ApiResult from "@/types/api-result.dto";
import WorkspaceFeatureDto from "@/types/workspace-feature.dto";
import WorkspaceDto from "@/types/workspace.dto";

export async function getWorkspacesByTeamId(teamId: string): Promise<ApiResult<WorkspaceDto[]>> {
  const response = await api.get<ApiResult<WorkspaceDto[]>>(`/api/v1/teams/${teamId}/workspaces`);
  return response.data;
}

export async function getWorkspaceByWorkspaceId(workspaceId: string): Promise<ApiResult<WorkspaceDto | null>> {
  const response = await api.get<ApiResult<WorkspaceDto | null>>(`/api/v1/workspaces/${workspaceId}`);
  return response.data;
}

export interface CreateWorkspaceParam {
  name: string;
  description?: string;
}

export async function createWorkspace(teamId: string, param: CreateWorkspaceParam): Promise<ApiResult<WorkspaceDto>> {
  const response = await api.post<ApiResult<WorkspaceDto>>(`/api/v1/teams/${teamId}/workspaces`, param);
  return response.data;
}

export interface CreateWorkspaceFeatureParam {
  featureType: 'chat' | 'board';
  order: number;
  isDefault: boolean;
}

export async function createWorkspaceFeature(
  workspaceId: string, param: CreateWorkspaceFeatureParam
): Promise<ApiResult<WorkspaceFeatureDto>> {
  const response = await api.post<ApiResult<WorkspaceFeatureDto>>(`/api/v1/workspaces/${workspaceId}/features`, param);
  return response.data;
}