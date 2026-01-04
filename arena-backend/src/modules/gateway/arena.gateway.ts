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
import { Inject, Logger, UseGuards } from "@nestjs/common";
import Redis from "ioredis";
import { WsJwtAuthGuard } from "src/guards/ws-jwt-auth.guard";
import { MessageDto } from "src/dtos/message.dto";
import { REDIS_SUBSCRIBER } from "src/redis/redis.constants";

const REDIS_CHANNEL_MESSAGE = "arena:message:new";

@WebSocketGateway({
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

  constructor(
    @Inject(REDIS_SUBSCRIBER)
    private readonly subscriber: Redis,
  ) {}

  afterInit() {
    this.subscriber.subscribe(REDIS_CHANNEL_MESSAGE, (err) => {
      if (err) {
        this.logger.error(`Failed to subscribe to ${REDIS_CHANNEL_MESSAGE}`, err);
      } else {
        this.logger.log(`Subscribed to ${REDIS_CHANNEL_MESSAGE}`);
      }
    });

    this.subscriber.on("message", (channel, data) => {
      if (channel === REDIS_CHANNEL_MESSAGE) {
        const { channelId, message } = JSON.parse(data) as {
          channelId: string;
          message: MessageDto;
        };
        const roomName = `channel:${channelId}`;
        this.server.to(roomName).emit("message:new", message);
        this.logger.debug(`Broadcasted message to ${roomName}`);
      }
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
