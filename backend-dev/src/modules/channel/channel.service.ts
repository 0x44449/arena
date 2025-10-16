import { ChannelEntity } from "@/entities/channel.entity";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

@Injectable()
export class ChannelService {
  constructor(
    @InjectRepository(ChannelEntity) private readonly channelRepository: Repository<ChannelEntity>,
  ) {}

  async findChannelById(channelId: string): Promise<ChannelEntity | null> {
    return await this.channelRepository.findOne({ where: { channelId } });
  }
}