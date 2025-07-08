import ChatAttachmentDto from "@/types/chat-attachment.dto";
import ChatMessageDto from "@/types/chat-message.dto";
import { create } from "zustand";

interface ViewerState {
  message: ChatMessageDto | null;
  attachment: ChatAttachmentDto | null;
  open: boolean;
  openViewer: (message: ChatMessageDto, attachment: ChatAttachmentDto) => void;
  closeViewer: () => void;
}

export const useImageViewerStore = create<ViewerState>((set) => ({
  message: null,
  attachment: null,
  open: false,
  openViewer: (message: ChatMessageDto, attachment: ChatAttachmentDto) => set({ message, attachment, open: true }),
  closeViewer: () => set({ message: null, attachment: null, open: false }),
}));