import * as Dialog from '@radix-ui/react-dialog';
import { useImageViewerStore } from '../stores/image-viewer-store';
import { ReactZoomPanPinchRef, TransformComponent, TransformWrapper } from 'react-zoom-pan-pinch';
import { ChevronLeft, ChevronRight, Download, Info, RotateCcw, Share2, X, ZoomIn, ZoomOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { useEffect, useRef, useState } from 'react';
import ChatAttachmentDto from '@/types/chat-attachment.dto';

const ChatImageViewer = () => {
  const { open, message, attachment, closeViewer } = useImageViewerStore();

  const transformComponentRef = useRef<ReactZoomPanPinchRef | null>(null);
  const [ transformScale, setTransformScale ] = useState(1);

  const [attachments, setAttachments] = useState<ChatAttachmentDto[]>([]);
  const [attachmentIndex, setAttachmentIndex] = useState(0);

  useEffect(() => {
    if (open && message && attachment) {

      let index = 0;
      const atts: ChatAttachmentDto[] = [];

      for (const att of message.attachments) {
        if (att.type === 'image') {
          atts.push(att);

          if (att.fileId === attachment.fileId) {
            index = atts.length - 1; // 현재 첨부파일의 인덱스
          }
        }
      }

      setAttachments(atts);
      setAttachmentIndex(index);
    }

    if (!open) {
      setAttachments([]);
      setAttachmentIndex(0);
    }
  }, [open, message, attachment]);

  const setAttachmentIndexSafely = (index: number) => {
    if (index < 0) {
      index = 0; // 최소 인덱스는 0
    }
    if (index >= attachments.length) {
      index = attachments.length - 1; // 최대 인덱스는 마지막 첨부파일
    }
    if (index === attachmentIndex) {
      return; // 현재 인덱스와 같으면 아무것도 하지 않음
    }

    setAttachmentIndex(index);
    if (transformComponentRef.current) {
      transformComponentRef.current.resetTransform(0); // 이미지 변경 시 줌 초기화
    }
  }

  if (!open) {
    return null; // 열려있지 않으면 아무것도 렌더하지 않음
  }
  return (
    <Dialog.Root open={open} onOpenChange={val => !val && closeViewer()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/90" />
        <Dialog.Content className="fixed inset-0 flex items-center justify-center">
          {(attachments.length > 0) && (
            <div className="w-full h-full flex flex-col">

              {/* 상단 컨트롤 바 */}
              <div className="absolute top-0 left-0 right-0 z-10 bg-gradient-to-b from-black/60 to-transparent p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-white">
                      {attachments[attachmentIndex].file.name}
                    </span>
                    {attachments.length > 1 && (
                      <Badge variant="secondary" className="ml-2">
                        {attachmentIndex + 1} / {attachments.length}
                      </Badge>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      // onClick={() => setShowMetadata(!showMetadata)}
                      className="text-white hover:bg-white/20"
                    >
                      <Info size={20} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      // onClick={handleShare}
                      className="text-white hover:bg-white/20"
                    >
                      <Share2 size={20} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      // onClick={handleDownload}
                      className="text-white hover:bg-white/20"
                    >
                      <Download size={20} />
                    </Button>
                    <Separator orientation="vertical" className="h-6 bg-white/20" />
                    <Dialog.Close>
                      <Button
                        variant="ghost"
                        size="icon"
                        // onClick={onClose}
                        className="text-white hover:bg-white/20"
                      >
                        <X size={20} />
                      </Button>
                    </Dialog.Close>
                  </div>
                </div>
              </div>

              {/* 왼쪽 네비게이션 버튼 */}
              {attachments.length > 1 && attachmentIndex > 0 && (
                <div className="absolute left-4 top-1/2 -translate-y-1/2 z-10">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setAttachmentIndexSafely(attachmentIndex - 1)}
                    className="text-white hover:bg-white/20 w-12 h-12 rounded-full bg-black/20 backdrop-blur-sm"
                  >
                    <ChevronLeft size={24} />
                  </Button>
                </div>
              )}

              {/* 오른쪽 네비게이션 버튼 */}
              {attachments.length > 1 && attachmentIndex < attachments.length - 1 && (
                <div className="absolute right-4 top-1/2 -translate-y-1/2 z-10">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setAttachmentIndexSafely(attachmentIndex + 1)}
                    className="text-white hover:bg-white/20 w-12 h-12 rounded-full bg-black/20 backdrop-blur-sm"
                  >
                    <ChevronRight size={24} />
                  </Button>
                </div>
              )}

              {/* 이미지 영역 */}
              <div className="flex-1 flex items-center justify-center cursor-grab active:cursor-grabbing">
                <TransformWrapper
                  ref={transformComponentRef}
                  onTransformed={(e, state) => {
                    setTransformScale(state.scale);
                  }}
                >
                  <TransformComponent
                    wrapperStyle={{ width: '100%', height: '100%' }}
                  >
                    <img
                      src={attachments[attachmentIndex].file.url}
                      alt={attachments[attachmentIndex].file.name}
                      className="max-w-none select-none"
                    />
                  </TransformComponent>
                </TransformWrapper>
              </div>

              {/* 썸네일 페이지네이션 */}
              {attachments.length > 1 && (
                <div className="absolute bottom-20 left-1/2 -translate-x-1/2 z-10">
                  <div className="flex items-center gap-2 bg-black/40 backdrop-blur-sm rounded-2xl py-2 px-4">
                    {attachments.map((attachment, index) => (
                      <button
                        key={attachment.fileId}
                        onClick={() => setAttachmentIndexSafely(index)}
                        className={`relative overflow-hidden rounded-lg transition-all duration-200 ${index === attachmentIndex
                          ? 'ring-2 ring-white w-12 h-12'
                          : 'opacity-60 hover:opacity-80 w-10 h-10'
                          }`}
                      >
                        <img
                          src={attachments[index].file.url}
                          alt={attachments[index].file.name}
                          className="w-full h-full object-cover"
                        />
                        {index === attachmentIndex && (
                          <div className="absolute inset-0 bg-white/10"></div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* 하단 컨트롤 바 */}
              <div className="absolute bottom-0 left-0 right-0 z-10 bg-gradient-to-t from-black/60 to-transparent p-4">
                <div className="flex items-center justify-center">
                  {/* 줌 컨트롤 */}
                  <div className="flex items-center gap-2 bg-black/20 backdrop-blur-sm rounded-full px-4 py-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => transformComponentRef.current?.zoomOut(0.2)}
                      className="text-white hover:bg-white/20 w-8 h-8"
                    >
                      <ZoomOut size={16} />
                    </Button>
                    <span className="text-white text-sm min-w-16 text-center">
                      {Math.round(transformScale * 100)}%
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => transformComponentRef.current?.zoomIn(0.2)}
                      className="text-white hover:bg-white/20 w-8 h-8"
                    >
                      <ZoomIn size={16} />
                    </Button>
                    <Separator orientation="vertical" className="h-4 bg-white/20" />
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => transformComponentRef.current?.resetTransform()}
                      className="text-white hover:bg-white/20 w-8 h-8"
                    >
                      <RotateCcw size={16} />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root >
  );
};

export default ChatImageViewer;