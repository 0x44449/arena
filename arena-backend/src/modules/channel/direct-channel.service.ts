import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ChannelEntity } from "src/entities/channel.entity";
import { ParticipantEntity } from "src/entities/participant.entity";
import { DirectChannelEntity } from "src/entities/direct-channel.entity";
import { DirectParticipantEntity } from "src/entities/direct-participant.entity";
import { UserEntity } from "src/entities/user.entity";
import { WellKnownException } from "src/exceptions/well-known-exception";
import { generateId } from "src/utils/id-generator";

@Injectable()
export class DirectChannelService {
  constructor(
    @InjectRepository(ChannelEntity)
    private readonly channelRepository: Repository<ChannelEntity>,
    @InjectRepository(ParticipantEntity)
    private readonly participantRepository: Repository<ParticipantEntity>,
    @InjectRepository(DirectChannelEntity)
    private readonly directChannelRepository: Repository<DirectChannelEntity>,
    @InjectRepository(DirectParticipantEntity)
    private readonly directParticipantRepository: Repository<DirectParticipantEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  /**
   * DM 채널 가져오기 (없으면 생성)
   *
   * DM은 두 유저 간 항상 최대 1개만 존재하는 특수한 리소스.
   * "대화 시작" 의도 자체가 "있으면 열고, 없으면 만들어"에 가깝기 때문에
   * 일반적인 create와 달리 getOrCreate 패턴을 사용한다.
   */
  async getOrCreate(
    myUserId: string,
    targetUserId: string,
  ): Promise<{ channel: ChannelEntity; participants: ParticipantEntity[] }> {
    // 자기 자신에게 DM 불가
    if (myUserId === targetUserId) {
      throw new WellKnownException({
        message: "Cannot create DM with yourself",
        errorCode: "INVALID_DM_TARGET",
      });
    }

    // 상대방 존재 확인
    const targetUser = await this.userRepository.findOne({
      where: { userId: targetUserId },
    });
    if (!targetUser) {
      throw new WellKnownException({
        message: "Target user not found",
        errorCode: "USER_NOT_FOUND",
      });
    }

    // 기존 DM 찾기
    const existingChannel = await this.findExistingDirectChannel(
      myUserId,
      targetUserId,
    );
    if (existingChannel) {
      const participants = await this.getParticipants(existingChannel.channelId);
      return { channel: existingChannel, participants };
    }

    // 새 DM 생성
    const channelId = generateId();

    const channel = this.channelRepository.create({
      channelId,
      type: "direct",
      name: null,
      teamId: null,
      lastMessageAt: null,
    });
    await this.channelRepository.save(channel);

    const directChannel = this.directChannelRepository.create({ channelId });
    await this.directChannelRepository.save(directChannel);

    // 양쪽 참여자 추가
    await this.addParticipant(channelId, myUserId);
    await this.addParticipant(channelId, targetUserId);

    const participants = await this.getParticipants(channelId);
    return { channel, participants };
  }

  private async findExistingDirectChannel(
    userId1: string,
    userId2: string,
  ): Promise<ChannelEntity | null> {
    const result = await this.channelRepository
      .createQueryBuilder("channel")
      .innerJoin("participants", "p1", "p1.channelId = channel.channelId")
      .innerJoin("participants", "p2", "p2.channelId = channel.channelId")
      .where("channel.type = :type", { type: "direct" })
      .andWhere("p1.userId = :userId1", { userId1 })
      .andWhere("p2.userId = :userId2", { userId2 })
      .getOne();

    return result;
  }

  private async addParticipant(
    channelId: string,
    userId: string,
  ): Promise<void> {
    const participant = this.participantRepository.create({
      channelId,
      userId,
      lastReadAt: null,
    });
    await this.participantRepository.save(participant);

    const directParticipant = this.directParticipantRepository.create({
      channelId,
      userId,
    });
    await this.directParticipantRepository.save(directParticipant);
  }

  private async getParticipants(channelId: string): Promise<ParticipantEntity[]> {
    return this.participantRepository.find({
      where: { channelId },
      relations: ["user", "user.avatar"],
    });
  }
}
