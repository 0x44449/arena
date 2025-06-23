import { useUserStore } from "./stores/user-store";
import { useEffect } from "react";
import { getMe } from "./api/user";
import TokenManager from "./lib/token-manager";
import { useTeamStore } from "./stores/team-store";
import { getTeams } from "./api/team";

export default function useBootstrap() {
  const user = useUserStore((state) => state.user);
  const setUser = useUserStore((state) => state.setUser);

  const teams = useTeamStore((state) => state.teams);
  const setTeams = useTeamStore((state) => state.setTeams);

  useEffect(() => {
    const accessToken = TokenManager.getAccessToken();
    if (!accessToken) {
      return;
    }
    
    // if (!user) {
    //   getMe().then((response) => {
    //     if (response.success && response.data) {
    //       setUser(response.data);
    //     } else {
    //       console.error("Failed to fetch user data");
    //     }
    //   });
    // }

    // if (teams.length === 0) {
    //   getTeams().then((response) => {
    //     if (response.success && response.data) {
    //       setTeams(response.data);
    //     } else {
    //       console.error("Failed to fetch teams");
    //     }
    //   });
    // }
  }, []);
}