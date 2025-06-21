import { ClientToServerEvents, ServerToClientEvents } from '@/types/socket-events';
import { io, Socket } from 'socket.io-client';
import TokenManager from './token-manager';

export const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io(`${import.meta.env.VITE_API_BASE_URL}/feature/chat`, {
  transports: ['websocket'],
  auth: {
    token: TokenManager.getAccessToken() || undefined,
  }
});