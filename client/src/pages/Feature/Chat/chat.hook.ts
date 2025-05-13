import { getMessages } from "@/api/chat";
import { socket } from "@/lib/socket";
import ChatMessageDto from "@/types/chat-message.dto";
import { useCallback, useEffect, useRef, useState } from "react";

interface ChatFeatureConnectionSyncProps {
  featureId: string;
}

export function useChatFeatureConnectionSync(props: ChatFeatureConnectionSyncProps) {
  const { featureId } = props;
  const prevFeatureIdRef = useRef<string | null>(null);

  useEffect(() => {
    if (!featureId) return;

    const prevFeatureId = prevFeatureIdRef.current;

    if (prevFeatureId === featureId) {
      console.log('Same, skipping join/leave', { featureId });
      return;
    }

    if (prevFeatureId) {
      console.log('Leaving chat feature', { featureId });
      socket.emit('chat:leave', {
        featureId: prevFeatureId
      });
    }

    console.log('Joining chat feature', { featureId });
    socket.emit('chat:join', {
      featureId
    });
    prevFeatureIdRef.current = featureId;

    return () => {
      const prevFeatureId = prevFeatureIdRef.current;
      prevFeatureIdRef.current = null;
      if (socket.connected && prevFeatureId) {
        console.log('Leaving chat feature on unmount', { featureId: prevFeatureId });
        socket.emit('chat:leave', {
          featureId: prevFeatureId
        });
      }
    }
  }, [featureId]);
}

interface ChatFeatureProps {
  featureId: string;
}

export function useChatFeature(props: ChatFeatureProps) {
  const { featureId } = props;
  const [messages, setMessages] = useState<ChatMessageDto[]>([]);

  useEffect(() => {
    setMessages([]);

    if (!featureId) return;

    getMessages(featureId).then((response) => {
      if (response.data) {
        setMessages(response.data);
      }
    });
  }, [featureId]);

  useEffect(() => {
    socket.on('chat:message', (payload: ChatMessageDto) => {
      setMessages((prevMessages) => [...prevMessages, payload]);
    });

    return () => {
      socket.off('chat:message');
    };
  }, []);

  const sendMessage = useCallback((message: string) => {
    if (!featureId) return;

    socket.emit('chat:message', {
      featureId,
      content: message
    });
  }, [featureId]);

  return { messages, sendMessage };
}