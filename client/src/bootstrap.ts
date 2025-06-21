import { useUserStore } from "./stores/user-store";
import { useEffect } from "react";
import { getMe } from "./api/user";
import TokenManager from "./lib/token-manager";

export default function useBootstrap() {
  const user = useUserStore((state) => state.user);
  const setUser = useUserStore((state) => state.setUser);

  useEffect(() => {
    const accessToken = TokenManager.getAccessToken();
    
    if (accessToken && !user) {
      getMe().then((response) => {
        if (response.success && response.data) {
          setUser(response.data);
        } else {
          console.error("Failed to fetch user data");
        }
      });
    }
  }, []);
}