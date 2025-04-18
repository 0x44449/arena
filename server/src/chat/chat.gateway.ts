import { Injectable } from "@nestjs/common";
import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { PrismaClient } from "@prisma/client";
import { Server, Socket } from 'socket.io';

interface JoinPayload {
  vaultId: string;
  zoneId: string;
  userId: string;
}

interface MessagePayload {
  vaultId: string;
  zoneId: string;
  userId: string;
  content: string;
}

const createRoomId = (vaultId: string, zoneId: string) => {
  return `vault:${vaultId}:zone:${zoneId}`;
}

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
@Injectable()
export class ChatGateway {
  @WebSocketServer()
  server: Server;

  constructor(private readonly prisma: PrismaClient) {}

  @SubscribeMessage("join")
  async handleJoin(@ConnectedSocket() client: Socket, @MessageBody() payload: JoinPayload) {
    const { vaultId, zoneId, userId } = payload;
    const roomId = createRoomId(vaultId, zoneId);

    await client.join(roomId);
    client.to(roomId).emit("system", `${userId} has entered the zone.`);
    console.log(`User ${userId} joined zone ${zoneId}`);
  }

  @SubscribeMessage("leave")
  async handleLeave(@ConnectedSocket() client: Socket, @MessageBody() payload: JoinPayload) {
    const { vaultId, zoneId, userId } = payload;
    const roomId = createRoomId(vaultId, zoneId);

    await client.leave(roomId);
    client.to(roomId).emit("system", `${userId} has left the zone.`);
    console.log(`User ${userId} left zone ${zoneId}`);
  }

  @SubscribeMessage("message")
  async handleMessage(@ConnectedSocket() client: Socket, @MessageBody() payload: MessagePayload) {
    const { vaultId, zoneId, userId, content } = payload;
    const roomId = createRoomId(vaultId, zoneId);

    const message = await this.prisma.message.create({
      data: {
        vaultId,
        zoneId,
        userId,
        content,
      },
    });

    const response: MessagePayload = {
      vaultId: message.vaultId,
      zoneId: message.zoneId,
      userId: message.userId,
      content: message.content,
    };

    client.to(roomId).emit("message", response);
    client.emit("message", response);
    console.log(`Message from ${userId} in vault ${vaultId} zone ${zoneId}: ${content}`);
  }
}