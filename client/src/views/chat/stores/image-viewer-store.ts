import ChatAttachmentDto from "@/types/chat-attachment.dto";
import { create } from "zustand";

interface ViewerState {
  attachment: ChatAttachmentDto | null;
  open: boolean;
  openViewer: (attachment: ChatAttachmentDto) => void;
  closeViewer: () => void;
}

export const useImageViewerStore = create<ViewerState>((set) => ({
  attachment: null,
  open: false,
  openViewer: (attachment: ChatAttachmentDto) => set({ attachment, open: true }),
  closeViewer: () => set({ attachment: null, open: false }),
}));