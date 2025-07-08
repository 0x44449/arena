import * as Dialog from '@radix-ui/react-dialog';
import { useImageViewerStore } from '../stores/image-viewer-store';
import { TransformComponent, TransformWrapper } from 'react-zoom-pan-pinch';
import { Download, Info, RotateCcw, Share2, X, ZoomIn, ZoomOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';

// ref 로 메서드만 노출, 상태는 내부 useState 로 관리
const ChatImageViewer = () => {
  const { open, attachment, closeViewer } = useImageViewerStore();

  if (!open) {
    return null; // 열려있지 않으면 아무것도 렌더하지 않음
  }
  return (
    <Dialog.Root open={open} onOpenChange={val => !val && closeViewer()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/90" />
        <Dialog.Content className="fixed inset-0 flex items-center justify-center">
          {attachment && (
            <div className="w-full h-full flex flex-col">

              {/* 1. 상단 컨트롤 바 */}
              <div className="absolute top-0 left-0 right-0 z-10 bg-gradient-to-b from-black/60 to-transparent p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-white">
                      {attachment.file.name}
                    </span>
                    {/* {images.length > 1 && (
                      <Badge variant="secondary" className="ml-2">
                        {currentIndex + 1} / {images.length}
                      </Badge>
                    )} */}
                    <Badge variant="secondary" className="ml-2">
                      1 / 1
                    </Badge>
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

              {/* 1. 이미지 영역 */}
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

              {/* 썸네일 페이지네이션 */}
              {/* {images.length > 1 && (
                <div className="absolute bottom-20 left-1/2 -translate-x-1/2 z-10">
                  <div className="flex items-center gap-2 bg-black/40 backdrop-blur-sm rounded-full p-2">
                    {images.map((image, index) => (
                      <button
                        key={image.id}
                        onClick={() => onNavigate && onNavigate(index)}
                        className={`relative overflow-hidden rounded-lg transition-all duration-200 ${index === currentIndex
                          ? 'ring-2 ring-white w-12 h-12'
                          : 'opacity-60 hover:opacity-80 w-10 h-10'
                          }`}
                      >
                        <ImageWithFallback
                          src={image.url}
                          alt={image.filename}
                          className="w-full h-full object-cover"
                        />
                        {index === currentIndex && (
                          <div className="absolute inset-0 bg-white/10"></div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )} */}
              <div className="absolute bottom-20 left-1/2 -translate-x-1/2 z-10">
                <div className="flex items-center gap-2 bg-black/40 backdrop-blur-sm rounded-full p-2">
                  <button
                    // onClick={() => onNavigate && onNavigate(index)}
                    className={`relative overflow-hidden rounded-lg transition-all duration-200 'opacity-60 hover:opacity-80 w-10 h-10'`}
                  >
                    <img
                      src={attachment.file.url}
                      alt={attachment.file.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-white/10"></div>
                  </button>

                  <button
                    // onClick={() => onNavigate && onNavigate(index)}
                    className={`relative overflow-hidden rounded-lg transition-all duration-200 'opacity-60 hover:opacity-80 w-10 h-10'`}
                  >
                    <img
                      src={attachment.file.url}
                      alt={attachment.file.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-white/10"></div>
                  </button>

                  <button
                    // onClick={() => onNavigate && onNavigate(index)}
                    className={`relative overflow-hidden rounded-lg transition-all duration-200 'opacity-60 hover:opacity-80 w-10 h-10'`}
                  >
                    <img
                      src={attachment.file.url}
                      alt={attachment.file.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-white/10"></div>
                  </button>
                </div>
              </div>

              {/* 하단 컨트롤 바 */}
              <div className="absolute bottom-0 left-0 right-0 z-10 bg-gradient-to-t from-black/60 to-transparent p-4">
                <div className="flex items-center justify-center">
                  {/* 줌 컨트롤 */}
                  <div className="flex items-center gap-2 bg-black/20 backdrop-blur-sm rounded-full px-4 py-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      // onClick={handleZoomOut}
                      className="text-white hover:bg-white/20 w-8 h-8"
                    >
                      <ZoomOut size={16} />
                    </Button>
                    <span className="text-white text-sm min-w-16 text-center">
                      {/* {Math.round(zoom * 100)}% */}
                      100%
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
                      // onClick={handleZoomIn}
                      className="text-white hover:bg-white/20 w-8 h-8"
                    >
                      <ZoomIn size={16} />
                    </Button>
                    <Separator orientation="vertical" className="h-4 bg-white/20" />
                    <Button
                      variant="ghost"
                      size="icon"
                      // onClick={resetZoom}
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