import * as Dialog from '@radix-ui/react-dialog';
import { useImageViewerStore } from '../stores/image-viewer-store';
import { TransformComponent, TransformWrapper } from 'react-zoom-pan-pinch';

// ref 로 메서드만 노출, 상태는 내부 useState 로 관리
const ChatImageViewer = () => {
  const { open, attachment, closeViewer } = useImageViewerStore();

  if (!open) {
    return null; // 열려있지 않으면 아무것도 렌더하지 않음
  }
  return (
    <Dialog.Root open={open} onOpenChange={val => !val && closeViewer()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/80" />
        <Dialog.Content className="fixed inset-0 flex items-center justify-center">
          {attachment && (
            <div className="w-full h-full flex flex-col">

              {/* 이미지 영역 */}
              <div className="flex-1 flex items-center justify-center cursor-grab active:cursor-grabbing">
                <TransformWrapper>
                  <TransformComponent
                    wrapperStyle={{ width: '100%', height: '100%' }}
                  >
                    <img
                      src={attachment.file.url}
                      alt={attachment.file.name}
                      className="max-w-none select-none"
                    />
                  </TransformComponent>
                </TransformWrapper>
              </div>
            </div>
          )}
          <Dialog.Close className="absolute top-4 right-4 text-white text-2xl">
            ✕
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root >
  );
};

export default ChatImageViewer;