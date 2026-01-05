import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ChannelEntity } from 'src/entities/channel.entity';
import { ParticipantEntity } from 'src/entities/participant.entity';
import { GroupChannelEntity } from 'src/entities/group-channel.entity';
import { GroupParticipantEntity } from 'src/entities/group-participant.entity';
import { UserEntity } from 'src/entities/user.entity';
import { FileEntity } from 'src/entities/file.entity';
import { WellKnownException } from 'src/exceptions/well-known-exception';
import { generateId } from 'src/utils/id-generator';

@Injectable()
export class GroupChannelService {
  constructor(
    @InjectRepository(ChannelEntity)
    private readonly channelRepository: Repository<ChannelEntity>,
    @InjectRepository(ParticipantEntity)
    private readonly participantRepository: Repository<ParticipantEntity>,
    @InjectRepository(GroupChannelEntity)
    private readonly groupChannelRepository: Repository<GroupChannelEntity>,
    @InjectRepository(GroupParticipantEntity)
    private readonly groupParticipantRepository: Repository<GroupParticipantEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(FileEntity)
    private readonly fileRepository: Repository<FileEntity>,
  ) {}

  /**
   * 그룹 채널 생성
   */
  async create(
    creatorUserId: string,
    name: string,
    userIds: string[],
    iconFileId: string | null,
  ): Promise<{
    channel: ChannelEntity;
    groupChannel: GroupChannelEntity;
    participants: ParticipantEntity[];
  }> {
    // 아이콘 파일 존재 확인
    if (iconFileId) {
      const iconFile = await this.fileRepository.findOne({
        where: { fileId: iconFileId },
      });
      if (!iconFile) {
        throw new WellKnownException({
          message: 'Icon file not found',
          errorCode: 'FILE_NOT_FOUND',
        });
      }
    }

    // 초대할 유저들 존재 확인
    for (const userId of userIds) {
      const user = await this.userRepository.findOne({
        where: { userId },
      });
      if (!user) {
        throw new WellKnownException({
          message: `User not found: ${userId}`,
          errorCode: 'USER_NOT_FOUND',
        });
      }
    }

    const channelId = generateId();

    // 공통 채널 생성
    const channel = this.channelRepository.create({
      channelId,
      type: 'group',
      name,
      teamId: null,
      lastMessageAt: null,
    });
    await this.channelRepository.save(channel);

    // 그룹 채널 확장 생성
    const groupChannel = this.groupChannelRepository.create({
      channelId,
      iconFileId,
    });
    await this.groupChannelRepository.save(groupChannel);

    // 생성자를 owner로 추가
    const creatorParticipant = this.participantRepository.create({
      channelId,
      userId: creatorUserId,
      lastReadAt: null,
    });
    await this.participantRepository.save(creatorParticipant);

    const creatorGroupParticipant = this.groupParticipantRepository.create({
      channelId,
      userId: creatorUserId,
      role: 'owner',
      nickname: null,
    });
    await this.groupParticipantRepository.save(creatorGroupParticipant);

    // 초대된 유저들을 member로 추가
    for (const userId of userIds) {
      if (userId !== creatorUserId) {
        const participant = this.participantRepository.create({
          channelId,
          userId,
          lastReadAt: null,
        });
        await this.participantRepository.save(participant);

        const groupParticipant = this.groupParticipantRepository.create({
          channelId,
          userId,
          role: 'member',
          nickname: null,
        });
        await this.groupParticipantRepository.save(groupParticipant);
      }
    }

    // participants 조회 (user relation 포함)
    const participants = await this.participantRepository.find({
      where: { channelId },
      relations: ['user', 'user.avatar'],
    });

    // groupChannel에 icon relation 로드
    const groupChannelWithIcon = await this.groupChannelRepository.findOne({
      where: { channelId },
      relations: ['icon'],
    });

    return {
      channel,
      groupChannel: groupChannelWithIcon!,
      participants,
    };
  }
}
