import WorkspaceDto from "@/types/workspace.dto";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createWorkspace, createWorkspaceFeature, CreateWorkspaceFeatureParam, CreateWorkspaceParam, getWorkspaceByWorkspaceId, getWorkspacesByTeamId } from "./workspace";

export function useWorkspacesQueryByTeamId(teamId: string | undefined) {
  return useQuery<WorkspaceDto[], Error>({
    queryKey: ['teams', teamId, 'workspaces'],
    queryFn: async () => {
      if (!teamId) throw new Error("teamId is required");

      const response = await getWorkspacesByTeamId(teamId);
      if (!response.success) {
        throw new Error("Failed to fetch workspaces");
      }

      return response.data;
    },
    enabled: !!teamId,
  });
}

export function useWorkspaceQueryByWorkspaceId(workspaceId: string | undefined) {
  return useQuery<WorkspaceDto | null, Error>({
    queryKey: ['workspaces', workspaceId],
    queryFn: async () => {
      if (!workspaceId) throw new Error("workspaceId is required");

      const response = await getWorkspacesByTeamId(workspaceId);
      if (!response.success) {
        throw new Error("Failed to fetch workspaces");
      }

      return response.data.find((workspace) => workspace.workspaceId === workspaceId) || null;
    },
    enabled: !!workspaceId,
  });
}

export function useCreateWorkspaceWithFeatureMutation(teamId: string) {
  const queryClient = useQueryClient();

  return useMutation({
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

      return workspaceRefresh.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['teams', teamId, 'workspaces'],
      });
    },
  })
}