import { useImageViewerStore } from '../stores/image-viewer-store';

export function useChatImageViewer() {
  const { openViewer, closeViewer } = useImageViewerStore();

  return {
    openViewer,
    closeViewer
  }
}