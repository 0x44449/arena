import { Injectable } from "@nestjs/common";
import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server, Socket } from 'socket.io';
import { LeaveChatPayload } from "./payload/leave-chat.payload";
import { JoinChatPayload } from "./payload/join-chat.payload";
import { formatDate } from "@/common/util/time";
import ArenaCredential from "@/auth/arena-credential";
import { AuthService } from "@/auth/auth.service";
import { ChatMessageDto } from "@/dto/chat-message.dto";

interface SocketAuthPayload {
  token?: string;
}

interface ArenaSocket extends Socket {
  handshake: Socket['handshake'] & { auth: SocketAuthPayload };
  data: {
    credential: ArenaCredential;
  }
}

@WebSocketGateway({
  namespace: '/feature/chat',
})
@Injectable()
// @UseGuards(WsAuthGuard)
export class ChatGateway {
  @WebSocketServer()
  server: Server;

  constructor(
    private readonly authService: AuthService,
  ) {}

  // lifecycle hook: client 연결시 자동으로 호출됨
  handleConnection(client: ArenaSocket) {
    const token = client.handshake.auth['token'];
    if (!token) {
      console.log(`[${formatDate('HH:mm:ss.SSS')}] Client disconnected due to missing token`);
      return client.disconnect();
    }

    const tokenPayload = this.authService.verifyToken(token);
    if (!tokenPayload) {
      console.log(`[${formatDate('HH:mm:ss.SSS')}] Client disconnected due to invalid token`);
      return client.disconnect();
    }

    const credential: ArenaCredential = {
      userId: tokenPayload.userId,
    };
    client.data.credential = credential;
  }

  @SubscribeMessage("chat:join")
  async handleJoin(
    @ConnectedSocket() client: ArenaSocket, @MessageBody() payload: JoinChatPayload
  ) {
    const { featureId } = payload;
    const credential = client.data.credential;
    const userId = credential.userId;

    await client.join(featureId);
    client.to(featureId).emit("system", `${userId} has entered the chat.`);
    console.log(`[${formatDate('HH:mm:ss.SSS')}] User ${userId} joined zone ${featureId}`);
  }

  @SubscribeMessage("chat:leave")
  async handleLeave(
    @ConnectedSocket() client: ArenaSocket, @MessageBody() payload: LeaveChatPayload
  ) {
    const { featureId } = payload;
    const credential = client.data.credential;
    const userId = credential.userId;

    await client.leave(featureId);
    client.to(featureId).emit("system", `${userId} has left the chat.`);
    console.log(`[${formatDate('HH:mm:ss.SSS')}] User ${userId} left zone ${featureId}`);
  }

  notifyChatMessage(featureId: string, message: ChatMessageDto) {
    this.server.to(featureId).emit("chat:message", message);
    console.log(`[${formatDate('HH:mm:ss.SSS')}] Broadcast message in ${featureId}: ${message.text}`);
  }
}