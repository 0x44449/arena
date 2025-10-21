import { ChatMessageEntity } from "@/entities/chat-message.entity";
import { RedisModule } from "@/libs/redis/redis.module";
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ChatGateway } from "./chat.gateway";
import { ChatService } from "./chat.service";
import { ChatController } from "./chat.controller";

@Module({
  imports: [TypeOrmModule.forFeature([ChatMessageEntity]), RedisModule.forFeature()],
  controllers: [ChatController],
  providers: [ChatGateway, ChatService],
})
export class ChatModule {}