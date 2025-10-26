import { ChatMessageEntity } from "@/entities/chat-message.entity";
import { RedisModule } from "@/libs/redis/redis.module";
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ChatService } from "./chat.service";
import { ChatController } from "./chat.controller";
import { AuthModule } from "../auth/auth.module";
import { RealtimeModule } from "../realtime/realtime.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([ChatMessageEntity]),
    RedisModule.forFeature(),
    AuthModule,
    RealtimeModule,
  ],
  controllers: [ChatController],
  providers: [ChatService],
})
export class ChatModule {}