import TeamDto from "@/types/team.dto";
import { useMutation, UseMutationOptions, useQuery, useQueryClient, UseQueryOptions } from "@tanstack/react-query";
import { createTeam, CreateTeamParam, getTeams } from "./team";

export function useTeamsQuery(param?: {
  options?: Partial<UseQueryOptions<TeamDto[]>>
}) {
  return useQuery<TeamDto[], Error>({
    ...param?.options,
    queryKey: ["teams"],
    queryFn: async () => {
      const response = await getTeams();
      if (!response.success) {
        throw new Error("Failed to fetch teams");
      }

      return response.data;
    }
  });
}

export function useTeamQueryByTeamId(param?: {
  teamId: string | undefined,
  options?: Partial<UseQueryOptions<TeamDto | null>>
}) {
  const teamId = param?.teamId;

  return useQuery<TeamDto | null, Error>({
    ...param?.options,
    queryKey: ["teams", teamId],
    queryFn: async () => {
      if (!teamId) throw new Error("teamId is required");

      const response = await getTeams();
      if (!response.success) {
        throw new Error("Failed to fetch teams");
      }

      return response.data.find((team) => team.teamId === teamId) || null;
    },
    enabled: !!teamId && (param?.options?.enabled ?? true)
  });
}

export function useCachedTeam(param?: {
  teamId: string | undefined
}) {
  const teamId = param?.teamId;
  const queryClient = useQueryClient();

  const allTeams = queryClient.getQueryData<TeamDto[]>(['teams']);
  return allTeams?.find((o) => o.teamId === teamId) || null;
}

export function useCreateTeamMutation(param?: {
  options?: Partial<UseMutationOptions<TeamDto, Error, CreateTeamParam>>
}) {
  const queryClient = useQueryClient();

  return useMutation({
    ...param?.options,
    mutationFn: async (param: CreateTeamParam) => {
      const response = await createTeam(param);
      if (!response.success) {
        throw new Error("Failed to create team");
      }

      return response.data;
    },
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({
        queryKey: ["teams"],
      });

      param?.options?.onSuccess?.(data, variables, context);
    }
  });
}