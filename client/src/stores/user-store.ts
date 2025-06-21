import PublicUserDto from "@/types/public-user.dto";
import { create } from "zustand";

interface UserState {
  user: PublicUserDto | null;
  setUser: (user: PublicUserDto) => void;
  clearUser: () => void;
}

export const useUserStore = create<UserState>((set) => ({
  user: null,
  setUser: (user: PublicUserDto) => set({ user }),
  clearUser: () => set({ user: null }),
}));
