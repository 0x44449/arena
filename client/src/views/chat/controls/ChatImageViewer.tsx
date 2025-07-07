import * as Dialog from '@radix-ui/react-dialog';
import { ImageChatAttachmentMetadataType } from '@/types/chat-attachment-metadata.type';
import { useImageViewerStore } from '../stores/image-viewer-store';

// ref 로 메서드만 노출, 상태는 내부 useState 로 관리
const ChatImageViewer = () => {
  const { open, attachment, closeViewer } = useImageViewerStore();

  if (!open) {
    return null; // 열려있지 않으면 아무것도 렌더하지 않음
  }
  return (
    <Dialog.Root open={open} onOpenChange={val => !val && closeViewer()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/70" />
        <Dialog.Content className="fixed inset-0 flex items-center justify-center">
          <Dialog.Close className="absolute top-4 right-4 text-white text-2xl">
            ✕
          </Dialog.Close>
          {attachment && (
            <>
              <img
                src={attachment.file.url}
                alt={attachment.file.name}
                className="object-contain max-h-full max-w-full"
              />
              <footer className="mt-4 text-sm text-white/80">
                <div>{attachment.file.name}</div>
                {/* <div>{new Date(attachment.file.).toLocaleString()}</div> */}
                <div>{(attachment.metadata as ImageChatAttachmentMetadataType).width}×{(attachment.metadata as ImageChatAttachmentMetadataType).height}</div>
              </footer>
            </>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root >
  );
};

export default ChatImageViewer;