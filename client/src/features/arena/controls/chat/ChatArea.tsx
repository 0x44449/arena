import ChatMessageDto from "@/types/chat-message.dto";

interface ChatAreaProps {
  messages: ChatMessageDto[];
}

export default function ChatArea(props: ChatAreaProps) {
  const { messages } = props;

  return (
    <div className="flex flex-col flex-1 overflow-y-auto bg-white px-4 py-2">
      {messages.map((message, idx) => (
        <div key={idx} className="mb-2">
          <div className="flex items-start gap-3 px-4 py-2">
            {/* 아바타 */}
            <img
              src={message.sender.avatarUrl}
              alt="avatar"
              className="w-10 h-10 rounded-full object-cover"
            />

            {/* 메시지 본문 */}
            <div className="flex flex-col">
              {/* 이름 + 시간 */}
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-gray-800">{message.sender.displayName}</span>
                <span className="text-xs text-gray-400">{new Date(message.createdAt).toLocaleTimeString()}</span>
              </div>

              {/* 메시지 내용 */}
              <div className="text-sm text-gray-700 whitespace-pre-wrap">
                {message.content}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}