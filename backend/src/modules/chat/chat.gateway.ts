import ArenaCredential from "@/commons/arena-credential";
import { ArenaSocket } from "@/commons/arena-socket";
import ClientCred from "@/decorators/client-cred.decorator";
import { Injectable } from "@nestjs/common";
import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
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

@WebSocketGateway({
  namespace: '/feature/chat'
})
@Injectable()
export class ChatGateway {
  constructor(
    @InjectRepository(UserEntity) private readonly userRepository: Repository<UserEntity>,
  ) {}

  @WebSocketServer()
  server: Server;

  /** Lifecycle hook - client 연결시 자동 호출 */
  async handleConnection(client: ArenaSocket) {
    const token = client.handshake.auth['token'];
    if (!token) {
      return client.disconnect();
    }

    // const tokenPayload = this.authService.verifyToken(token);
    let decoded: DecodedIdToken | null = null;
    try {
      decoded = await firebaseAdmin.auth().verifyIdToken(token);
    } catch {
      return client.disconnect();
    }
    if (!decoded) {
      return client.disconnect();
    }

    const user = await this.userRepository.findOne({ where: { uid: decoded.uid } });
    if (!user) {
      return client.disconnect();
    }

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