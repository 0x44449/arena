import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useQuery } from "@tanstack/react-query";
import { Gift, Plus, Smile } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import ChatMessage from "./chat-message";
import { ChatMessageDto } from "@/api/generated";
import chatApi from "@/api/chat-api";
import ws from "@/api/ws.socket";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface ChatMainProps {
  teamId: string;
  workspaceId: string;
}

export default function ChatMain(props: ChatMainProps) {
  const { teamId, workspaceId } = props;

  const [messages, setMessages] = useState<ChatMessageDto[]>([]);
  const [hoveredMessage, setHoveredMessage] = useState<string | null>(null);

  const [messageInput, setMessageInput] = useState("");
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const initialize = async () => {
    console.log('ws connected:', ws.connected);
    if (!ws.connected) {
      ws.connect();
      console.log('ws connecting...');
    }
    ws.emit('chat:join', { workspaceId });
    ws.on('chat:message', (message: ChatMessageDto) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    const result = await chatApi.getChatMessagesByWorkspaceId(workspaceId, {
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
      ws.emit('chat:leave', { workspaceId });
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

      await chatApi.createChatMessage(workspaceId, {
        message: trimmedMessage
      });
      setMessageInput("");
    }
  }

  return (
    <div className="flex flex-col flex-1">
      {/* Messages Area */}
      <ScrollArea ref={scrollAreaRef} className="flex-1">
        <div className="py-4">
          {/* Messages */}
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

      {/* Message Input */}
      <div className="flex w-full p-2 bg-white border-t border-[#F3F4F6]">
        <div className="flex flex-1 bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg">
          <div className="flex flex-1 flex-row space-x-2 p-2 items-center">
            <button className="p-0.5 hover:bg-[#E5E7EB] rounded transition-colors duration-150 flex-shrink-0">
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

      {/* <div className="p-2 bg-white border-t border-[#F3F4F6]">
        <div className="relative">
          <div className="bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg overflow-hidden hover:border-[#8B5CF6] transition-colors duration-200">
            <div className="flex items-end space-x-2 p-2">
              <button className="p-1.5 hover:bg-[#E5E7EB] rounded transition-colors duration-150 flex-shrink-0">
                <Plus className="w-5 h-5 text-[#6B7280]" />
              </button>
              <div className="flex flex-1 justify-center items-center">
                <textarea
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder={`#에 메시지 보내기`}
                  className="w-full bg-transparent text-gray-800 placeholder-[#9CA3AF] resize-none focus:outline-none max-h-32 border"
                  rows={1}
                  style={{
                    height: 'auto',
                    minHeight: '20px'
                  }}
                  onInput={(e) => {
                    const target = e.target as HTMLTextAreaElement;
                    target.style.height = 'auto';
                    target.style.height = 10 + target.scrollHeight + 'px';
                  }}
                />
              </div>
              <div className="flex items-center space-x-1 flex-shrink-0">
                <button className="p-1.5 hover:bg-[#E5E7EB] rounded transition-colors duration-150">
                  <Gift className="w-5 h-5 text-[#6B7280]" />
                </button>
                <button className="p-1.5 hover:bg-[#E5E7EB] rounded transition-colors duration-150">
                  <Smile className="w-5 h-5 text-[#6B7280]" />
                </button>
              </div>
              {messageInput.trim() && (
                <Button
                  // onClick={handleSendMessage}
                  // className="absolute right-3 bottom-3 bg-[#8B5CF6] hover:bg-[#7C3AED] text-white px-3 py-1.5 text-sm h-auto"
                  className="right-3 bottom-3 bg-[#8B5CF6] hover:bg-[#7C3AED] text-white px-3 py-1.5 text-sm h-auto"
                >
                  전송
                </Button>
              )}
            </div>
          </div>
        </div>
      </div> */}
    </div>
  )
}