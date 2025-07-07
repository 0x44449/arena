import { useRef } from "react";
import { useChatStore } from "../stores/chat-store";
import { useVirtualizer } from '@tanstack/react-virtual';
import ChatMessage from "./ChatMessage";

interface ChatAreaProps {
}

export default function ChatArea(props: ChatAreaProps) {
  const boxRef = useRef<HTMLDivElement>(null);
  const { messages } = useChatStore();
  const virtualizer = useVirtualizer({
    count: messages.length,
    getScrollElement: () => boxRef.current,
    estimateSize: () => 50,
    overscan: 5,
    measureElement: (element) => {
      if (!element) return 50; // 기본 높이
      return element.getBoundingClientRect().height;
    }
  });

  return (
    <div ref={boxRef} className="overflow-auto h-full w-full">
      <div
        className="px-4 py-2 relative w-full"
        style={{ height: `${virtualizer.getTotalSize()}px`, }}
      >
        {virtualizer.getVirtualItems().map((virtualItem) => {
          const message = messages[virtualItem.index];

          return (
            <div
              key={virtualItem.key}
              data-index={virtualItem.index}
              ref={virtualizer.measureElement}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                transform: `translateY(${virtualItem.start}px)`,
              }}
            >
              <ChatMessage key={message.messageId} message={message} />
            </div>
          )
        })}
      </div>
    </div>
  )
}
