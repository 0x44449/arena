import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ChannelEntity } from 'src/entities/channel.entity';
import { ParticipantEntity } from 'src/entities/participant.entity';
import { GroupChannelEntity } from 'src/entities/group-channel.entity';
import { WellKnownException } from 'src/exceptions/well-known-exception';

export interface ChannelWithDetails {
  channel: ChannelEntity;
  participants: ParticipantEntity[];
  groupChannel: GroupChannelEntity | null;
}

@Injectable()
export class ChannelService {
  constructor(
    @InjectRepository(ChannelEntity)
    private readonly channelRepository: Repository<ChannelEntity>,
    @InjectRepository(ParticipantEntity)
    private readonly participantRepository: Repository<ParticipantEntity>,
    @InjectRepository(GroupChannelEntity)
    private readonly groupChannelRepository: Repository<GroupChannelEntity>,
  ) {}

  /**
   * 내 채널 목록 조회
   */
  async getMyChannels(userId: string): Promise<ChannelWithDetails[]> {
    // 내가 참여한 채널 조회
    const myParticipants = await this.participantRepository.find({
      where: { userId },
      relations: ['channel'],
    });

    const results: ChannelWithDetails[] = [];

    for (const myParticipant of myParticipants) {
      const channel = myParticipant.channel;

      // 참여자 조회
      const participants = await this.participantRepository.find({
        where: { channelId: channel.channelId },
        relations: ['user', 'user.avatar'],
      });

      // 그룹 채널이면 추가 정보 조회
      let groupChannel: GroupChannelEntity | null = null;
      if (channel.type === 'group') {
        groupChannel = await this.groupChannelRepository.findOne({
          where: { channelId: channel.channelId },
          relations: ['icon'],
        });
      }

      results.push({ channel, participants, groupChannel });
    }

    // lastMessageAt 기준 정렬 (최신순, null은 마지막)
    results.sort((a, b) => {
      const aTime = a.channel.lastMessageAt?.getTime() ?? 0;
      const bTime = b.channel.lastMessageAt?.getTime() ?? 0;
      return bTime - aTime;
    });

    return results;
  }

  /**
   * 채널 상세 조회
   */
  async getChannel(
    channelId: string,
    userId: string,
  ): Promise<ChannelWithDetails> {
    // 참여 여부 확인
    const myParticipant = await this.participantRepository.findOne({
      where: { channelId, userId },
      relations: ['channel'],
    });

    if (!myParticipant) {
      throw new WellKnownException({
        message: 'Channel not found or not a participant',
        errorCode: 'CHANNEL_NOT_FOUND',
      });
    }

    const channel = myParticipant.channel;

    // 참여자 조회
    const participants = await this.participantRepository.find({
      where: { channelId: channel.channelId },
      relations: ['user', 'user.avatar'],
    });

    // 그룹 채널이면 추가 정보 조회
    let groupChannel: GroupChannelEntity | null = null;
    if (channel.type === 'group') {
      groupChannel = await this.groupChannelRepository.findOne({
        where: { channelId: channel.channelId },
        relations: ['icon'],
      });
    }

    return { channel, participants, groupChannel };
  }
}
