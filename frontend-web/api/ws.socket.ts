import { auth } from '@/plugins/firebase.plugin';
import { io } from 'socket.io-client';

const ws = io(`${process.env.NEXT_PUBLIC_API_BASE_URL}/feature/chat`, {
  transports: ['websocket'],
  autoConnect: false,
  withCredentials: true,
});

ws.on('reconnect_attempt', async () => {
  ws.auth = { token: await auth.currentUser?.getIdToken(true) };
});

export default ws;