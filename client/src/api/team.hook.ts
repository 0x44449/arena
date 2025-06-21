import TeamDto from "@/types/team.dto";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createTeam, CreateTeamParam, getTeams } from "./team";

export function useTeamsQuery() {
  return useQuery<TeamDto[], Error>({
    queryKey: ["teams"],
    queryFn: async () => {
      const response = await getTeams();
      if (!response.success) {
        throw new Error("Failed to fetch teams");
      }

      return response.data;
    },
  });
}

export function useTeamQueryByTeamId(teamId: string | undefined) {
  return useQuery<TeamDto | null, Error>({
    queryKey: ["teams", teamId],
    queryFn: async () => {
      if (!teamId) throw new Error("teamId is required");

      const response = await getTeams();
      if (!response.success) {
        throw new Error("Failed to fetch teams");
      }

      return response.data.find((team) => team.teamId === teamId) || null;
    },
    enabled: !!teamId,
  });
}

export function useCachedTeam(teamId: string | undefined) {
  const queryClient = useQueryClient();

  const allTeams = queryClient.getQueryData<TeamDto[]>(['teams']);
  return allTeams?.find((o) => o.teamId === teamId) || null;
}

export function useCreateTeamMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (param: CreateTeamParam) => {
      const response = await createTeam(param);
      if (!response.success) {
        throw new Error("Failed to create team");
      }

      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["teams"],
      });
    },
  });
}