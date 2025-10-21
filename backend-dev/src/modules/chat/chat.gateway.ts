import { Injectable } from "@nestjs/common";
import { ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Socket } from "socket.io";

@WebSocketGateway(80, { namespace: "chat" })
@Injectable()
export class ChatGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  afterInit(server: any) {
    console.log("ChatGateway initialized");
  }

  handleConnection(client: any, ...args: any[]) {
    console.log("Client connected:", client.id);
  }

  handleDisconnect(client: any) {
    console.log("Client disconnected:", client.id);
  }

  @SubscribeMessage("chat:join")
  async handleJoin(@ConnectedSocket() socket: Socket, @MessageBody() data: any) {
  }

  @SubscribeMessage("chat:leave")
  async handleLeave(@ConnectedSocket() socket: Socket, @MessageBody() data: any) {
  }
}