import TeamDto from "@/types/team.dto";
import { create } from "zustand";

interface TeamState {
  teams: TeamDto[];
  setTeams: (teams: TeamDto[]) => void;
  addTeam: (team: TeamDto) => void;
  removeTeam: (teamId: string) => void;
}

export const useTeamStore = create<TeamState>((set, get) => ({
  teams: [],
  setTeams: (teams: TeamDto[]) => set({ teams }),
  addTeam: (team: TeamDto) => set({ teams: [...get().teams, team] }),
  removeTeam: (teamId: string) => set({ teams: get().teams.filter(team => team.teamId !== teamId) }),
  addOrUpdateTeam: (team: TeamDto) => set({
    teams: get().teams.some(t => t.teamId === team.teamId)
      ? get().teams.map(t => t.teamId === team.teamId ? team : t)
      : [...get().teams, team]
  }),
  clearTeams: () => set({ teams: [] })
}));