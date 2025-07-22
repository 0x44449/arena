import ArenaCredential from "@/commons/arena-credential";
import { ArenaSocket } from "@/commons/arena-socket";
import ClientCred from "@/decorators/client-cred.decorator";
import { WsAuthGuard } from "@/guards/ws-auth.guard";
import { Injectable, UseGuards } from "@nestjs/common";
import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server } from "socket.io";
import { JoinChatPayload } from "./payloads/join-chat.payload";
import { LeaveChatPayload } from "./payloads/leave-chat.payload";

@WebSocketGateway({
  namespace: '/feature/chat'
})
@Injectable()
export class ChatGateway {
  @WebSocketServer()
  server: Server;

  @UseGuards(WsAuthGuard)
  @SubscribeMessage('chat:join')
  async handleJoin(@ConnectedSocket() client: ArenaSocket, @MessageBody() payload: JoinChatPayload, @ClientCred() credential: ArenaCredential) {
    const { workspaceId } = payload;
    const userId = credential.user.userId;

    await client.join(workspaceId);

    client.to(workspaceId).emit('system', `User ${userId} has joined the chat in workspace.`);
  }

  @UseGuards(WsAuthGuard)
  @SubscribeMessage('chat:leave')
  async handleLeave(@ConnectedSocket() client: ArenaSocket, @MessageBody() payload: LeaveChatPayload, @ClientCred() credential: ArenaCredential) {
    const { workspaceId } = payload;
    const userId = credential.user.userId;

    await client.leave(workspaceId);

    client.to(workspaceId).emit('system', `User ${userId} has left the chat in workspace.`);
  }
}