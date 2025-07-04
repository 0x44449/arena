import ChatMessageDto from "@/types/chat-message.dto";
import ChatAttachment from "./ChatAttachment";

interface ChatMessageProps {
  message: ChatMessageDto;
}

export default function ChatMessage(props: ChatMessageProps) {
  const { message } = props;

  return (
    <div className="mb-2">
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
          <div className="flex items-center gap-2 mb-1">
            <span className="text-sm font-semibold text-gray-800">{message.sender.displayName}</span>
            <span className="text-xs text-gray-400">{new Date(message.createdAt).toLocaleTimeString()}</span>
          </div>

          {/* 첨부파일 영역 */}
          {message.attachments && message.attachments.length > 0 && (
            <>
              {message.attachments.map((attachment) => (
                <ChatAttachment key={attachment.fileId} message={message} attachment={attachment} />
              ))}
            </>
          )}

          {/* 메시지 내용 */}
          <div className="text-sm text-gray-700 whitespace-pre-wrap">
            {message.text}
          </div>
        </div>
      </div>
    </div>
  );
}