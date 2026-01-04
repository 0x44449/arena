import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ChannelEntity } from "src/entities/channel.entity";
import { ParticipantEntity } from "src/entities/participant.entity";
import { DirectChannelEntity } from "src/entities/direct-channel.entity";
import { DirectParticipantEntity } from "src/entities/direct-participant.entity";
import { GroupChannelEntity } from "src/entities/group-channel.entity";
import { GroupParticipantEntity } from "src/entities/group-participant.entity";
import { UserEntity } from "src/entities/user.entity";
import { FileEntity } from "src/entities/file.entity";
import { ChannelController } from "./channel.controller";
import { ChannelService } from "./channel.service";
import { DirectChannelService } from "./direct-channel.service";
import { GroupChannelService } from "./group-channel.service";
import { FileModule } from "../file/file.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ChannelEntity,
      ParticipantEntity,
      DirectChannelEntity,
      DirectParticipantEntity,
      GroupChannelEntity,
      GroupParticipantEntity,
      UserEntity,
      FileEntity,
    ]),
    FileModule,
  ],
  controllers: [ChannelController],
  providers: [ChannelService, DirectChannelService, GroupChannelService],
  exports: [ChannelService, DirectChannelService, GroupChannelService],
})
export class ChannelModule {}
