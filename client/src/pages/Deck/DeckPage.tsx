import { useZoneQueryById } from "@/hooks/zone";
import { useParams } from "react-router-dom";
import './DeckPage.css';
import { useState } from "react";
import { useChatDeck, useChatDeckConnectionSync } from "./DeckPage.chat-hook";
import { ChatMessage } from "./ChatMessage";

function DeckPage() {
  const { vaultId, zoneId } = useParams<{ vaultId: string, zoneId: string }>();
  const { data: zone } = useZoneQueryById(vaultId, zoneId);

  useChatDeckConnectionSync({ vaultId, zoneId, userId: 'zina' });
  const { messages, sendMessage } = useChatDeck({ vaultId, zoneId, userId: 'zina' });

  const [content, setContent] = useState('');

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && content.trim()) {
      sendMessage(content);
      setContent('');
    }
  }

  return (
    <div className="deck">
      <div className="deck-header">
        <div className="deck-title">{zone?.name ?? ''}</div>
      </div>

      <main className="deck-body">
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
          {/* 기능 콘텐츠 영역 → 이후 채우기 */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '16px' }}>
            {messages.map((msg) => (
              <ChatMessage key={msg.messageId} message={msg} />
            ))}
          </div>

          {/* ✏️ 입력창 */}
          <div
            style={{
              padding: '12px',
              backgroundColor: '#f9fafb',
              borderTop: '1px solid #e5e7eb',
            }}
          >
            <input
              value={content}
              onChange={(e) => setContent(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="메시지를 입력하세요"
              style={{
                width: '100%',
                padding: '10px 14px',
                fontSize: '14px',
                borderRadius: '8px',
                border: '1px solid #d1d5db',
                outline: 'none',
                boxSizing: 'border-box', // ✅ padding + width 충돌 방지
              }}
            />
          </div>
        </div>
      </main>
    </div>
  )
}

export default DeckPage;
