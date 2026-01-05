import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  ConnectedSocket,
  MessageBody,
} from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { Logger, UseGuards } from "@nestjs/common";
import { WsJwtAuthGuard } from "src/guards/ws-jwt-auth.guard";
import { Signal } from "src/signal/signal";
import { SignalChannel } from "src/signal/signal.channels";

@WebSocketGateway({
  path: "/ws",
  namespace: "/arena",
  cors: {
    origin: "*",
  },
})
export class ArenaGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(ArenaGateway.name);

  constructor(private readonly signal: Signal) {}

  afterInit() {
    this.signal.subscribe(SignalChannel.MESSAGE_NEW, ({ channelId, message }) => {
      const roomName = `channel:${channelId}`;
      this.server.to(roomName).emit("message:new", message);
      this.logger.debug(`Broadcasted message to ${roomName}`);
    });
  }

  async handleConnection(client: Socket) {
    const token = client.handshake.auth?.token;

    if (!token) {
      this.logger.warn(`Client ${client.id} rejected: no token`);
      client.disconnect();
      return;
    }

    this.logger.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  @UseGuards(WsJwtAuthGuard)
  @SubscribeMessage("channel:join")
  handleJoinChannel(
    @ConnectedSocket() client: Socket,
    @MessageBody() channelId: string,
  ) {
    const roomName = `channel:${channelId}`;
    client.join(roomName);
    this.logger.log(`Client ${client.id} joined ${roomName}`);
    return { success: true, channelId };
  }

  @UseGuards(WsJwtAuthGuard)
  @SubscribeMessage("channel:leave")
  handleLeaveChannel(
    @ConnectedSocket() client: Socket,
    @MessageBody() channelId: string,
  ) {
    const roomName = `channel:${channelId}`;
    client.leave(roomName);
    this.logger.log(`Client ${client.id} left ${roomName}`);
    return { success: true, channelId };
  }
}
