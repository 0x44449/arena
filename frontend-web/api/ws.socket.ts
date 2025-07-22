import { auth } from '@/plugins/firebase.plugin';
import { io } from 'socket.io-client';

const ws = io(`${process.env.NEXT_PUBLIC_API_BASE_URL}/feature/chat`, {
  transports: ['websocket'],
  autoConnect: false,
  auth: async (cb) => {
    const user = auth.currentUser;
    if (user) {
      const idToken = await user.getIdToken(false);
      if (idToken) {
        cb({ token: idToken });
      }
    }
  }
});

ws.on('reconnect_attempt', async () => {
  ws.auth = { token: await auth.currentUser?.getIdToken(true) };
});

export default ws;