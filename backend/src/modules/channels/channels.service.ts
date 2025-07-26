import { ChannelEntity } from "@/entities/channel.entity";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CreateChannelDto } from "./dtos/create-channel.dto";
import { UserEntity } from "@/entities/user.entity";
import { idgen } from "@/commons/id-generator";

@Injectable()
export class ChannelsService {
  constructor(
    @InjectRepository(ChannelEntity) private readonly channelsRepository: Repository<ChannelEntity>,
  ) {}

  async createChannel(param: CreateChannelDto, owner: UserEntity): Promise<ChannelEntity> {
    const channel = this.channelsRepository.create({
      channelId: idgen.shortId(),
      name: param.name,
      description: param.description,
      teamId: param.teamId,
      ownerId: owner.userId,
    });

    await this.channelsRepository.save(channel);
    const savedChannel = await this.channelsRepository.findOne({
      where: { channelId: channel.channelId },
      relations: ['owner', 'team'],
    });

    if (!savedChannel) {
      throw new Error(`Channel with ID ${channel.channelId} not found`);
    }

    return savedChannel;
  }

  async findChannelByChannelId(channelId: string): Promise<ChannelEntity> {
    const channel = await this.channelsRepository.findOne({
      where: { channelId },
      relations: ['owner', 'team'],
    });

    if (!channel) {
      throw new Error(`Channel with ID ${channelId} not found`);
    }

    return channel;
  }

  async findChannelsByTeamId(teamId: string): Promise<ChannelEntity[]> {
    return this.channelsRepository.find({
      where: { teamId },
      relations: ['owner', 'team'],
    });
  }
}