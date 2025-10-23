import { ChannelEntity } from "@/entities/channel.entity";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { nanoid } from "nanoid";
import { Repository } from "typeorm";
import { UpdateChannelDto } from "./dtos/update-channel.dto";
import { WellKnownError } from "@/exceptions/well-known-error";
import { UserEntity } from "@/entities/user.entity";

@Injectable()
export class ChannelService {
  constructor(
    @InjectRepository(ChannelEntity) private readonly channelRepository: Repository<ChannelEntity>,
  ) {}

  async findChannelById(channelId: string): Promise<ChannelEntity | null> {
    return await this.channelRepository.findOne({
      where: { channelId },
      relations: ["owner"],
    });
  }

  async createChannel(param: { name: string; description: string; teamId: string, ownerId: string }): Promise<ChannelEntity> {
    const channel = this.channelRepository.create({
      channelId: nanoid(12),
      name: param.name,
      description: param.description,
      teamId: param.teamId,
      ownerId: param.ownerId,
    });

    await this.channelRepository.save(channel);
    const saved = await this.channelRepository.findOne({
      where: { channelId: channel.channelId },
      relations: ["owner"],
    });

    if (!saved) {
      throw new WellKnownError({
        message: "Failed to create channel",
        errorCode: "CHANNEL_CREATION_FAILED",
      });
    }
    return saved;
  }

  async updateChannel(channelId: string, param: UpdateChannelDto, me: UserEntity): Promise<ChannelEntity> {
    const channel = await this.channelRepository.findOne({ where: { channelId } });
    if (!channel) {
      throw new WellKnownError({
        message: "Channel not found",
        errorCode: "CHANNEL_NOT_FOUND",
      });
    }

    if (channel.ownerId !== me.userId) {
      throw new WellKnownError({
        message: "You are not the owner of this channel",
        errorCode: "CHANNEL_PERMISSION_DENIED",
      });
    }

    await this.channelRepository.update(channelId, param);
    const updated = await this.channelRepository.findOne({
      where: { channelId },
      relations: ["owner"],
    });
    if (!updated) {
      throw new WellKnownError({
        message: "Channel not found",
        errorCode: "CHANNEL_NOT_FOUND",
      });
    }

    return updated;
  }

  async deleteChannel(channelId: string, me: UserEntity): Promise<void> {
    const channel = await this.channelRepository.findOne({ where: { channelId } });
    if (!channel) {
      throw new WellKnownError({
        message: "Channel not found",
        errorCode: "CHANNEL_NOT_FOUND",
      });
    }

    if (channel.ownerId !== me.userId) {
      throw new WellKnownError({
        message: "You are not the owner of this channel",
        errorCode: "CHANNEL_PERMISSION_DENIED",
      });
    }

    await this.channelRepository.delete(channelId);
  }
}