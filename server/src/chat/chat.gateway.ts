import { Injectable } from "@nestjs/common";
import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { plainToInstance } from "class-transformer";
import { Server, Socket } from 'socket.io';
import { ChatService } from "./chat.service";
import { ChatJoinPayload } from "./payload/join-chat.payload";
import { LeaveChatPayload } from "./payload/leave-chat.payload";
import { ChatMessagePayload } from "./payload/chat-message.payload";
import { ChatMessageDto } from "@/dto/chat-message.dto";

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
@Injectable()
export class ChatGateway {
  @WebSocketServer()
  server: Server;

  constructor(private readonly chatService: ChatService) {}

  @SubscribeMessage("join")
  async handleJoin(@ConnectedSocket() client: Socket, @MessageBody() payload: ChatJoinPayload) {
    const { featureId } = payload;
    const userId = 'admin';

    await client.join(featureId);
    client.to(featureId).emit("system", `${userId} has entered the chat.`);
    console.log(`User ${userId} joined zone ${featureId}`);
  }

  @SubscribeMessage("leave")
  async handleLeave(@ConnectedSocket() client: Socket, @MessageBody() payload: LeaveChatPayload) {
    const { featureId } = payload;
    const userId = 'admin';

    await client.leave(featureId);
    client.to(featureId).emit("system", `${userId} has left the chat.`);
    console.log(`User ${userId} left zone ${featureId}`);
  }

  @SubscribeMessage("message")
  async handleMessage(@ConnectedSocket() client: Socket, @MessageBody() payload: ChatMessagePayload) {
    const { featureId, content } = payload;
    const userId = 'admin';

    const message = await this.chatService.createMessage(payload, 'admin');

    client.to(featureId).emit("message", plainToInstance(ChatMessageDto, message));
    client.emit("message", plainToInstance(ChatMessageDto, message));
    console.log(`Message from ${userId} in ${featureId}: ${content}`);
  }
}