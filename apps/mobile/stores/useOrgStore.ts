import type { OrgDto } from "@/api/generated/arenaAPI.schemas";
import { create } from "zustand";

interface OrgState {
  currentOrg: OrgDto | null;
  setCurrentOrg: (org: OrgDto) => void;
  clearCurrentOrg: () => void;
}

export const useOrgStore = create<OrgState>((set) => ({
  currentOrg: null,
  setCurrentOrg: (org) => set({ currentOrg: org }),
  clearCurrentOrg: () => set({ currentOrg: null }),
}));
