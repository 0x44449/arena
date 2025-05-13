import { Injectable, UseGuards } from "@nestjs/common";
import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { plainToInstance } from "class-transformer";
import { Server, Socket } from 'socket.io';
import { ChatService } from "./chat.service";
import { LeaveChatPayload } from "./payload/leave-chat.payload";
import { ChatMessagePayload } from "./payload/chat-message.payload";
import { ChatMessageDto } from "@/dto/chat-message.dto";
import { WsAuthGuard } from "@/auth/ws-auth.guard";
import { WsUser } from "@/auth/ws-user.decorator";
import { UserEntity } from "@/entity/user.entity";
import { JoinChatPayload } from "./payload/join-chat.payload";
import { formatDate } from "@/common/util/time";

@WebSocketGateway({
  cors: {
    origin: '*',
  },
  namespace: '/feature/chat',
})
@Injectable()
@UseGuards(WsAuthGuard)
export class ChatGateway {
  @WebSocketServer()
  server: Server;

  constructor(private readonly chatService: ChatService) {}

  @SubscribeMessage("chat:join")
  async handleJoin(@ConnectedSocket() client: Socket, @MessageBody() payload: JoinChatPayload, @WsUser() user: UserEntity) {
    const { featureId } = payload;
    const userId = 'admin';

    await client.join(featureId);
    client.to(featureId).emit("system", `${userId} has entered the chat.`);
    console.log(`[${formatDate('HH:mm:ss.SSS')}] User ${userId} joined zone ${featureId}`);
  }

  @SubscribeMessage("chat:leave")
  async handleLeave(@ConnectedSocket() client: Socket, @MessageBody() payload: LeaveChatPayload, @WsUser() user: UserEntity) {
    const { featureId } = payload;
    const userId = 'admin';

    await client.leave(featureId);
    client.to(featureId).emit("system", `${userId} has left the chat.`);
    console.log(`[${formatDate('HH:mm:ss.SSS')}] User ${userId} left zone ${featureId}`);
  }

  @SubscribeMessage("chat:message")
  async handleMessage(@ConnectedSocket() client: Socket, @MessageBody() payload: ChatMessagePayload, @WsUser() user: UserEntity) {
    const { featureId, content } = payload;
    const userId = 'admin';

    const message = await this.chatService.createMessage(payload, 'admin');

    client.to(featureId).emit("message", plainToInstance(ChatMessageDto, message));
    client.emit("chat:message", plainToInstance(ChatMessageDto, message));
    console.log(`[${formatDate('HH:mm:ss.SSS')}] Message from ${userId} in ${featureId}: ${content}`);
  }
}