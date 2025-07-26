import { ChannelEntity } from "@/entities/channel.entity";
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ChannelsController } from "./channels.controller";
import { ChannelsService } from "./channels.service";
import { TeamEntity } from "@/entities/team.entity";
import { UserEntity } from "@/entities/user.entity";

@Module({
  imports: [TypeOrmModule.forFeature([TeamEntity, ChannelEntity, UserEntity])],
  controllers: [ChannelsController],
  providers: [ChannelsService],
  exports: [TypeOrmModule],
})
export class ChannelsModule {}