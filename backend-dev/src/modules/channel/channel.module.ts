import { ChannelEntity } from "@/entities/channel.entity";
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ChannelController } from "./channel.controller";
import { ChannelService } from "./channel.service";
import { AuthModule } from "../auth/auth.module";

@Module({
  imports: [TypeOrmModule.forFeature([ChannelEntity]), AuthModule],
  controllers: [ChannelController],
  providers: [ChannelService],
})
export class ChannelModule {}