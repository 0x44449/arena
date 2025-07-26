import ArenaCredential from "@/commons/arena-credential";
import { ArenaSocket } from "@/commons/arena-socket";
import { Injectable } from "@nestjs/common";
import { ConnectedSocket, MessageBody, OnGatewayConnection, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server } from "socket.io";
import { JoinChatPayload } from "./payloads/join-chat.payload";
import { LeaveChatPayload } from "./payloads/leave-chat.payload";
import { ChatMessageDto } from "@/dtos/chat-message.dto";
import { ChatMessageEntity } from "@/entities/chat-message.entity";
import { AuthService } from "../auth/auth.service";

@WebSocketGateway({
  namespace: '/feature/chat'
})
@Injectable()
export class ChatGateway implements OnGatewayConnection {
  constructor(
    private readonly authService: AuthService,
  ) {}

  @WebSocketServer()
  server: Server;

  /** Lifecycle hook - client 연결시 자동 호출 */
  async handleConnection(client: ArenaSocket) {
    let token = client.handshake.auth['token'];
    if (!token) {
      const cookie = client.handshake.headers.cookie;
      if (cookie) {
        const cookieToken = cookie.split('; ').find(row => row.startsWith('arena_session='));
        if (cookieToken) {
          const tokenValue = cookieToken.split('=')[1];
          if (tokenValue) {
            token = tokenValue;
          }
        }
      }
    }

    if (!token) {
      return client.disconnect();
    }

    try {
      const user = await this.authService.verifyArenaTokenStrict(token);
      const credential: ArenaCredential = { user: user };
      client.data.credential = credential;
    } catch {
      return client.disconnect();
    }
  }

  @SubscribeMessage('chat:join')
  async handleJoin(@ConnectedSocket() client: ArenaSocket, @MessageBody() payload: JoinChatPayload) {
    const { channelId } = payload;
    const credential = client.data.credential;
    const userId = credential.user.userId;

    await client.join(channelId);

    client.to(channelId).emit('system', `User ${userId} has joined the chat in channel ${channelId}.`);
  }

  @SubscribeMessage('chat:leave')
  async handleLeave(@ConnectedSocket() client: ArenaSocket, @MessageBody() payload: LeaveChatPayload) {
    const { channelId } = payload;
    const credential = client.data.credential;
    const userId = credential.user.userId;

    await client.leave(channelId);

    client.to(channelId).emit('system', `User ${userId} has left the chat in channel ${channelId}.`);
  }

  notifyMessage(channelId: string, message: ChatMessageEntity) {
    const messageDto = ChatMessageDto.fromEntity(message);
    this.server.to(channelId).emit('chat:message', messageDto);
  }
}