import WorkspaceDto from "@/types/workspace.dto";
import { create } from "zustand";

interface SelectedWorkspaceState {
  selectedWorkspace: WorkspaceDto | null;
  selectWorkspace: (workspace: WorkspaceDto | null) => void;
  unselectWorkspace: () => void;
}

const useSelectedWorkspaceStore = create<SelectedWorkspaceState>((set, get) => ({
  selectedWorkspace: null,
  selectWorkspace: (workspace: WorkspaceDto | null) => {
    set({ selectedWorkspace: workspace });
  },
  unselectWorkspace: () => {
    set({ selectedWorkspace: null });
  }
}));

export default useSelectedWorkspaceStore;