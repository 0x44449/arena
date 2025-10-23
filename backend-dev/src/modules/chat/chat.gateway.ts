import { Injectable } from "@nestjs/common";
import { ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { AuthService } from "../auth/auth.service";
import type { ArenaWsSocket } from "@/auth/ws/arena-ws-socket";
import type { JoinChannelPayload } from "./payloads/join-channel.payload";
import type { LeaveChatPayload } from "./payloads/leave-channel.payload";
import { ChatMessageEntity } from "@/entities/chat-message.entity";

@WebSocketGateway(80, { namespace: "chat" })
@Injectable()
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(
    private readonly authService: AuthService,
  ) {}

  @WebSocketServer()
  server: Server;

  async handleConnection(client: ArenaWsSocket, ...args: any[]) {
    const token = client.handshake.auth?.token;
    if (!token) {
      console.log("No token provided, disconnecting client:", client.id);
      return client.disconnect(true);
    }

    try {
      const credential = await this.authService.verifyWebSocketSTS(token);
      if (!credential.user) {
        console.log("Invalid token, disconnecting client:", client.id);
        return client.disconnect(true);
      }

      client.data.credential = credential;
    } catch (error) {
      console.log("Error verifying token, disconnecting client:", client.id);
      return client.disconnect(true);
    }

    client.client.conn.on("packet", (packet) => {
      if (packet.type !== "pong") return;

      const exp = client.data.credential.payload.exp;
      if (!exp) return;

      const expLeft = exp * 1000 - Date.now();
      if (expLeft < 30000 && expLeft > 0) {
        client.emit("auth:refresh");
      }
      if (expLeft <= 0) {
        client.disconnect(true);
      }
    });
  }

  handleDisconnect(client: ArenaWsSocket) {
    console.log("Client disconnected:", client.id);
  }

  @SubscribeMessage("channel:join")
  async handleJoin(@ConnectedSocket() client: ArenaWsSocket, @MessageBody() payload: JoinChannelPayload) {
    const { channelId } = payload;
    const credential = client.data.credential;

    await client.join(channelId);

    client.to(channelId).emit("system", `User ${credential.user?.userId} has joined the channel ${channelId}.`);
  }

  @SubscribeMessage("channel:leave")
  async handleLeave(@ConnectedSocket() client: ArenaWsSocket, @MessageBody() payload: LeaveChatPayload) {
    const { channelId } = payload;
    const credential = client.data.credential;

    await client.leave(channelId);
    
    client.to(channelId).emit("system", `User ${credential.user?.userId} has left the channel ${channelId}.`);
  }

  notifyMessage(channelId: string, message: ChatMessageEntity) {
    this.server.to(channelId).emit("channel:message", message);
  }
}