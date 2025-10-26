import { Injectable } from "@nestjs/common";
import { ConnectedSocket, MessageBody, OnGatewayConnection, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server } from "socket.io";
import { AuthService } from "../auth/auth.service";
import type { ArenaWsSocket } from "@/auth/ws/arena-ws-socket";
import type { JoinChannelPayload } from "./payloads/join-channel.payload";
import type { LeaveChannelPayload } from "./payloads/leave-channel.payload";
import { ChannelEventPublisher } from "./channel-event.publisher";
import { UserDto } from "@/dtos/user.dto";

@WebSocketGateway(80, { namespace: "channel" })
@Injectable()
export class ChannelEventGateway implements OnGatewayConnection {
  constructor(
    private readonly channelPub: ChannelEventPublisher,
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

  @SubscribeMessage("channel:join")
  async handleJoin(@ConnectedSocket() client: ArenaWsSocket, @MessageBody() payload: JoinChannelPayload) {
    const { channelId } = payload;
    const credential = client.data.credential;

    this.channelPub.join(channelId, UserDto.fromEntity(credential.user!));

    await client.join(channelId);
  }

  @SubscribeMessage("channel:leave")
  async handleLeave(@ConnectedSocket() client: ArenaWsSocket, @MessageBody() payload: LeaveChannelPayload) {
    const { channelId } = payload;
    const credential = client.data.credential;

    await client.leave(channelId);

    this.channelPub.leave(channelId, UserDto.fromEntity(credential.user!));
  }

  broadcastToChannel(channelId: string, event: string, payload: any) {
    this.server.to(channelId).emit(event, payload);
  }
}