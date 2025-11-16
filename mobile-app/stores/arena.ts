import { create } from "zustand";

interface ArenaState {
  user: string | null;
  signIn: (username: string) => void;
  signOut: () => void;
}

export const useArenaStore = create<ArenaState>()((set) => ({
  user: null,
  signIn: (username: string) => set({ user: username }),
  signOut: () => set({ user: null }),
}));
