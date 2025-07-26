import { ChatMessageDto } from "@/api/generated";
import { Heart, MoreHorizontal, Pin, Reply } from "lucide-react";

interface ChatMessageProps {
  message: ChatMessageDto;
  prevMessage?: ChatMessageDto;
  hovered?: boolean;
}

export default function ChatMessage(props: ChatMessageProps) {
  const { message, prevMessage, hovered } = props;

  const isConsecutiveMessage = (currentMessage: ChatMessageDto, prevMessage?: ChatMessageDto) => {
    if (!prevMessage) return false;
    const currentDate = new Date(currentMessage.createdAt);
    const prevDate = new Date(prevMessage.createdAt);

    return currentMessage.sender.userId === prevMessage.sender.userId &&
      currentDate.getFullYear() === prevDate.getFullYear() &&
      currentDate.getMonth() === prevDate.getMonth() &&
      currentDate.getDate() === prevDate.getDate() &&
      currentDate.getHours() === prevDate.getHours() &&
      currentDate.getMinutes() === prevDate.getMinutes(); // 같은 분
  };

  const isConsecutive = isConsecutiveMessage(message, prevMessage);

  const formatTime = (timestamp: Date) => {
    return new Intl.DateTimeFormat('ko-KR', {
      hour: '2-digit',
      minute: '2-digit'
    }).format(timestamp);
  };

  return (
    <div className="flex flex-col group relative px-6 py-1 hover:bg-[#F9FAFB] transition-colors duration-150">
      <div className="flex items-start space-x-4">
        {!isConsecutive ? (
          <div className="w-10 h-10 rounded-full overflow-hidden bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center flex-shrink-0 mt-1">
            <img src={message.sender.avatarUrl} alt={message.sender.displayName} className="w-full h-full object-cover" />
          </div>
        ) : (
          <div className="w-10 h-5 flex items-center justify-center flex-shrink-0">
            <span className="text-xs text-[#9CA3AF] opacity-0 group-hover:opacity-100 transition-opacity">
              {formatTime(new Date(message.createdAt))}
            </span>
          </div>
        )}

        <div className="flex-1 min-w-0">
          {!isConsecutive && (
            <div className="flex items-baseline space-x-2 mb-1">
              <span
                className="font-semibold text-gray-800"
              // style={{ color: user?.color }}
              >
                {message.sender.displayName}
              </span>
              {/* {message.isBot && (
                <span className="bg-[#8B5CF6] text-white text-xs px-1.5 py-0.5 rounded font-medium">
                  BOT
                </span>
              )} */}
              <span className="text-xs text-[#6B7280]">
                {formatTime(new Date(message.createdAt))}
              </span>
            </div>
          )}
          <div className="text-gray-800 leading-relaxed">
            {message.message}
          </div>
        </div>
      </div>

      {/* Message Actions */}
      {hovered && (
        <div className="absolute top-0 right-4 bg-white border border-[#E5E7EB] rounded-lg shadow-sm flex items-center opacity-0 group-hover:opacity-100 transition-all duration-150 z-10">
          <button className="p-1.5 hover:bg-[#F3F4F6] rounded transition-colors duration-150">
            <Heart className="w-4 h-4 text-[#6B7280]" />
          </button>
          <button className="p-1.5 hover:bg-[#F3F4F6] rounded transition-colors duration-150">
            <Reply className="w-4 h-4 text-[#6B7280]" />
          </button>
          <button className="p-1.5 hover:bg-[#F3F4F6] rounded transition-colors duration-150">
            <Pin className="w-4 h-4 text-[#6B7280]" />
          </button>
          <button className="p-1.5 hover:bg-[#F3F4F6] rounded transition-colors duration-150">
            <MoreHorizontal className="w-4 h-4 text-[#6B7280]" />
          </button>
        </div>
      )}
    </div>
  )
}