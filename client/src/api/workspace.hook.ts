import WorkspaceDto from "@/types/workspace.dto";
import { useMutation, UseMutationOptions, useQuery, useQueryClient, UseQueryOptions } from "@tanstack/react-query";
import { createWorkspace, createWorkspaceFeature, CreateWorkspaceFeatureParam, CreateWorkspaceParam, getWorkspaceByWorkspaceId, getWorkspacesByTeamId } from "./workspace";

export function useWorkspacesQueryByTeamId(param?: {
  teamId: string | undefined,
  options?: Partial<UseQueryOptions<WorkspaceDto[]>>
}) {
  const teamId = param?.teamId;

  return useQuery<WorkspaceDto[], Error>({
    ...param?.options,
    queryKey: ['teams', teamId, 'workspaces'],
    queryFn: async () => {
      if (!teamId) throw new Error("teamId is required");

      const response = await getWorkspacesByTeamId(teamId);
      if (!response.success) {
        throw new Error("Failed to fetch workspaces");
      }

      return response.data;
    }
  });
}

export function useWorkspaceQueryByWorkspaceId(param?: {
  workspaceId: string | undefined,
  options?: Partial<UseQueryOptions<WorkspaceDto | null>>
}) {
  const workspaceId = param?.workspaceId;

  return useQuery<WorkspaceDto | null, Error>({
    ...param?.options,
    queryKey: ['workspaces', workspaceId],
    queryFn: async () => {
      if (!workspaceId) throw new Error("workspaceId is required");

      const response = await getWorkspaceByWorkspaceId(workspaceId);
      if (!response.success) {
        throw new Error("Failed to fetch workspace");
      }

      return response.data;
    }
  });
}

export function useCreateWorkspaceWithFeatureMutation(param: {
  teamId: string,
  options?: Partial<UseMutationOptions<WorkspaceDto, Error, { workspace: CreateWorkspaceParam; feature: CreateWorkspaceFeatureParam }>>
}) {
  const teamId = param?.teamId;
  const queryClient = useQueryClient();

  return useMutation({
    ...param?.options,
    mutationFn: async (
      { workspace, feature }: { workspace: CreateWorkspaceParam; feature: CreateWorkspaceFeatureParam }
    ) => {
      const workspaceResponse = await createWorkspace(teamId, workspace);
      if (!workspaceResponse.success) {
        throw new Error("Failed to create workspace");
      }

      const workspaceId = workspaceResponse.data.workspaceId;
      const featureResponse = await createWorkspaceFeature(workspaceId, feature);
      if (!featureResponse.success) {
        throw new Error("Failed to create workspace feature");
      }

      const workspaceRefresh = await getWorkspaceByWorkspaceId(workspaceId);
      if (!workspaceRefresh.success) {
        throw new Error("Failed to create workspace");
      }

      if (!workspaceRefresh.data) {
        throw new Error("Workspace data is null");
      }

      return workspaceRefresh.data;
    },
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({
        queryKey: ['teams', teamId, 'workspaces'],
      });

      param?.options?.onSuccess?.(data, variables, context);
    }
  });
}