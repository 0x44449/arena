import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Gift, Plus, Smile, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import ChatMessage from "./chat-message";
import { ChatMessageDto } from "@/api/generated";
import chatApi from "@/api/chat-api";
import ws from "@/api/ws.socket";

interface SelectedImage {
  id: string;
  file: File;
  preview: string;
}

interface ChatMainProps {
  teamId: string;
  channelId: string;
}

export default function ChatMain(props: ChatMainProps) {
  const { teamId, channelId } = props;

  const [messages, setMessages] = useState<ChatMessageDto[]>([]);
  const [hoveredMessage, setHoveredMessage] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [images, setImages] = useState<SelectedImage[]>([]);

  const [messageInput, setMessageInput] = useState("");
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const initialize = async () => {
    console.log('ws connected:', ws.connected);
    if (!ws.connected) {
      ws.connect();
      console.log('ws connecting...');
    }
    ws.emit('chat:join', { channelId });
    ws.on('chat:message', (message: ChatMessageDto) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    const result = await chatApi.getChatMessagesByChannelId(channelId, {
      limit: 50,
      direction: 'prev',
      seq: -1,
    });
    if (!result.success) {
      console.error("Failed to fetch chat messages:", result.errorCode);
      return;
    }

    console.log("Fetched chat messages:", result.data.items);
    setMessages(result.data.items);
  }
  useEffect(() => {
    initialize();

    return () => {
      ws.off('chat:message');
      ws.emit('chat:leave', { channelId });
      console.log('ws disconnected');
    }
  }, []);

  const handleMessageInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    console.log('Message input changed:', e.target.value);
    setMessageInput(e.target.value);

    const target = e.target as HTMLTextAreaElement;
    target.style.height = 'auto';
    target.style.height = `${target.scrollHeight}px`;
  }

  const handleMessageInputKeyDown = async (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    console.log('Key pressed:', e.key);
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();

      const trimmedMessage = messageInput.trim();
      if (!trimmedMessage) return;

      await chatApi.createChatMessage(channelId, {
        message: trimmedMessage
      });
      setMessageInput("");
    }
  }

  const handlePlusButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    const newImages: SelectedImage[] = [];

    Array.from(files).forEach((file) => {
      if (file.type.startsWith('image/')) {
        const imageId = Date.now().toString() + Math.random();
        const preview = URL.createObjectURL(file);

        newImages.push({
          id: imageId,
          file,
          preview
        });
      }
    });

    setImages(prev => [...prev, ...newImages]);

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleRemoveImage = (imageId: string) => {
    setImages(prev => {
      const imageToRemove = prev.find(img => img.id === imageId);
      if (imageToRemove) {
        URL.revokeObjectURL(imageToRemove.preview);
      }
      return prev.filter(img => img.id !== imageId);
    });
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="flex flex-col flex-1 min-h-0 min-w-0 h-full">
      {/* Messages Area */}
      <ScrollArea ref={scrollAreaRef} className="flex flex-1 min-h-0 min-w-0 overflow-y-auto">
        <div className="py-4">
          <div className="space-y-0.5">
            {messages.map((message, index) => (
              <div
                key={message.messageId}
                onMouseEnter={() => setHoveredMessage(message.messageId)}
                onMouseLeave={() => setHoveredMessage(null)}
              >
                <ChatMessage
                  message={message}
                  prevMessage={messages[index - 1]}
                  hovered={hoveredMessage === message.messageId}
                />
              </div>
            ))}
          </div>
        </div>
      </ScrollArea>

      {/* Image Preview Area */}
      <div className="flex w-full px-2 min-w-0">
        {images.length > 0 && (
          <div className="flex flex-col p-3 bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg w-full min-w-0">
            <div className="flex items-center justify-between mb-2 w-full min-w-0">
              <span className="text-sm text-[#6B7280] font-medium">
                {images.length}개의 이미지 선택됨
              </span>
              <button
                onClick={() => {
                  images.forEach(img => URL.revokeObjectURL(img.preview));
                  setImages([]);
                }}
                className="text-xs text-[#8B5CF6] hover:text-[#7C3AED] transition-colors duration-150"
              >
                모두 제거
              </button>
            </div>
            <div className="flex gap-3 overflow-x-auto pb-2">
              {images.map((image) => (
                <div key={image.id} className="relative group flex-shrink-0">
                  <div className="relative w-24 h-24 rounded-lg overflow-hidden bg-gray-100">
                    <img
                      src={image.preview}
                      alt={image.file.name}
                      className="w-full h-full object-cover"
                    />
                    <button
                      onClick={() => handleRemoveImage(image.id)}
                      className="absolute top-1 right-1 w-5 h-5 bg-black bg-opacity-50 hover:bg-opacity-75 rounded-full flex items-center justify-center transition-all duration-150 opacity-0 group-hover:opacity-100"
                    >
                      <X className="w-3 h-3 text-white" />
                    </button>
                  </div>
                  <div className="mt-1 w-24">
                    <div className="text-xs text-[#6B7280] truncate">
                      {image.file.name}
                    </div>
                    <div className="text-xs text-[#9CA3AF]">
                      {formatFileSize(image.file.size)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Message Input */}
      {/* <div className="flex w-full p-2 bg-white border-t border-[#F3F4F6]"> */}
      <div className="flex w-full p-2">
        <div className="flex flex-1 bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg">
          <div className="flex flex-1 flex-row space-x-2 p-2 items-center">
            <button
              className="p-0.5 hover:bg-[#E5E7EB] rounded transition-colors duration-150 flex-shrink-0"
              onClick={handlePlusButtonClick}
            >
              <Plus className="w-5 h-5 text-[#6B7280]" />
            </button>

            <div className="flex flex-1 flex-col">
              <textarea
                value={messageInput}
                onChange={handleMessageInputChange}
                onKeyDown={handleMessageInputKeyDown}
                className="w-full min-w-0 box-border bg-transparent max-h-32 focus:outline-none text-gray-800 placeholder-[#9CA3AF] resize-none"
                rows={1}
                placeholder={`#에 메시지 보내기`}
              />
            </div>

            <div className="flex flex-row items-center space-x-1 flex-shrink-0">
              <button className="p-1.5 hover:bg-[#E5E7EB] rounded transition-colors duration-150">
                <Gift className="w-5 h-5 text-[#6B7280]" />
              </button>
              <button className="p-1.5 hover:bg-[#E5E7EB] rounded transition-colors duration-150">
                <Smile className="w-5 h-5 text-[#6B7280]" />
              </button>
              <Button
                disabled={true}
                className="bg-[#8B5CF6] hover:bg-[#7C3AED] text-white px-3 py-1.5 text-sm h-auto"
              >
                전송
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleFileSelect}
        className="hidden"
      />
    </div>
  )
}