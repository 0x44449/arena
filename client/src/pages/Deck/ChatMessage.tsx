import { Message } from "@/types/api";
import './ChatMessage.css';

export function ChatMessage(props: { message: Message }) {
  const { message } = props;

  return (
    <div className="chat-message">
      <div className="chat-avatar">{message.sender.loginId[0]}</div>
      <div className="chat-content">
        <div className="chat-meta">
          <span className="chat-sender">{message.sender.displayName}</span>
          <span className="chat-time">{new Date(message.createdAt).toLocaleTimeString()}</span>
        </div>
        <div className="chat-text">{message.content}</div>
      </div>
    </div>
  );
}
