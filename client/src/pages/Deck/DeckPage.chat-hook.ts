import { getMessages } from "@/api/chat";
import { socket } from "@/lib/socket";
import { Message } from "@/types/api";
import { useCallback, useEffect, useRef, useState } from "react";

interface ChatDeckConnectionSyncProps {
  vaultId?: string;
  zoneId?: string;
  userId: string;
}

export function useChatDeckConnectionSync(props: ChatDeckConnectionSyncProps) {
  const { vaultId, zoneId, userId } = props;
  const prevParams = useRef<{ vaultId: string, zoneId: string } | null>(null);

  useEffect(() => {
    if (!vaultId || !zoneId) return;

    if (prevParams.current && prevParams.current.vaultId !== vaultId && prevParams.current.zoneId !== zoneId) {
      socket.emit("leave", {
        vaultId: prevParams.current.vaultId,
        zoneId: prevParams.current.zoneId,
        userId: userId,
      });
    }

    socket.emit("join", {
      vaultId: vaultId,
      zoneId: zoneId,
      userId: userId,
    });

    prevParams.current = { vaultId, zoneId };

    return () => {
      socket.emit("leave", {
        vaultId: vaultId,
        zoneId: zoneId,
        userId: userId,
      });
    }
  }, [vaultId, zoneId, userId]);
}

interface ChatDeckProps {
  vaultId?: string;
  zoneId?: string;
  userId: string;
}

export function useChatDeck(props: ChatDeckProps) {
  const { vaultId, zoneId, userId } = props;
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    if (!vaultId || !zoneId) return;
    getMessages(vaultId, zoneId).then((data) => {
      setMessages(data);
    });
  }, [vaultId, zoneId, userId]);

  useEffect(() => {
    const handleMessage = (message: Message) => {
      setMessages((prev) => [...prev, message]);
    }

    socket.on('message', handleMessage);
    return () => {
      socket.off('message', handleMessage);
    }
  }, [vaultId, zoneId, userId]);

  const sendMessage = useCallback((content: string) => {
    if (!vaultId || !zoneId) return;

    socket.emit('message', {
      vaultId: vaultId,
      zoneId: zoneId,
      userId: userId,
      content: content,
    });
  }, [vaultId, zoneId, userId]);

  return { messages, sendMessage };
}