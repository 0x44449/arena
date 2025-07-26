import { ChatMessageEntity } from "@/entities/chat-message.entity";
import { FileEntity } from "@/entities/file.entity";
import { UserEntity } from "@/entities/user.entity";
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ChatGateway } from "./chat.gateway";
import { ChatService } from "./chat.service";
import { ChatController } from "./chat.controller";
import { AuthModule } from "../auth/auth.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ChatMessageEntity,
      FileEntity,
      UserEntity,
    ]),
  ],
  providers: [ChatGateway, ChatService],
  controllers: [ChatController],
  exports: [TypeOrmModule],
})
export class ChatModule {}