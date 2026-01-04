import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { MessageEntity } from "src/entities/message.entity";
import { ChannelEntity } from "src/entities/channel.entity";
import { ParticipantEntity } from "src/entities/participant.entity";
import { MessageController } from "./message.controller";
import { MessageService } from "./message.service";
import { FileModule } from "../file/file.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([
      MessageEntity,
      ChannelEntity,
      ParticipantEntity,
    ]),
    FileModule,
  ],
  controllers: [MessageController],
  providers: [MessageService],
  exports: [MessageService],
})
export class MessageModule {}
