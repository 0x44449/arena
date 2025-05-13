import { ClientToServerEvents, ServerToClientEvents } from '@/types/socket-events';
import { io, Socket } from 'socket.io-client';

export const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io(`${import.meta.env.VITE_API_BASE_URL}/feature/chat`, {
  transports: ['websocket'],
  auth: {
    token: localStorage.getItem('accessToken') || undefined,  
  }
});