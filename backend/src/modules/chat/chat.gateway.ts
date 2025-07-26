import ArenaCredential from "@/commons/arena-credential";
import { ArenaSocket } from "@/commons/arena-socket";
import { Injectable } from "@nestjs/common";
import { ConnectedSocket, MessageBody, OnGatewayConnection, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server } from "socket.io";
import { JoinChatPayload } from "./payloads/join-chat.payload";
import { LeaveChatPayload } from "./payloads/leave-chat.payload";
import { ChatMessageDto } from "@/dtos/chat-message.dto";
import { ChatMessageEntity } from "@/entities/chat-message.entity";
import { DecodedIdToken } from "firebase-admin/lib/auth/token-verifier";
import firebaseAdmin from "@/commons/firebase.plugin";
import { InjectRepository } from "@nestjs/typeorm";
import { UserEntity } from "@/entities/user.entity";
import { Repository } from "typeorm";
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

    const user = await this.authService.verifyArenaTokenStrict(token);

    const credential: ArenaCredential = { user: user };
    client.data.credential = credential;
  }

  @SubscribeMessage('chat:join')
  async handleJoin(@ConnectedSocket() client: ArenaSocket, @MessageBody() payload: JoinChatPayload) {
    const { workspaceId } = payload;
    const credential = client.data.credential;
    const userId = credential.user.userId;

    await client.join(workspaceId);

    client.to(workspaceId).emit('system', `User ${userId} has joined the chat in workspace.`);
  }

  @SubscribeMessage('chat:leave')
  async handleLeave(@ConnectedSocket() client: ArenaSocket, @MessageBody() payload: LeaveChatPayload) {
    const { workspaceId } = payload;
    const credential = client.data.credential;
    const userId = credential.user.userId;

    await client.leave(workspaceId);

    client.to(workspaceId).emit('system', `User ${userId} has left the chat in workspace.`);
  }

  notifyMessage(workspaceId: string, message: ChatMessageEntity) {
    const messageDto = ChatMessageDto.fromEntity(message);
    this.server.to(workspaceId).emit('chat:message', messageDto);
  }
}