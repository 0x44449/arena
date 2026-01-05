import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import Redis from 'ioredis';
import { MessageEntity } from 'src/entities/message.entity';
import { ChannelEntity } from 'src/entities/channel.entity';
import { ParticipantEntity } from 'src/entities/participant.entity';
import { WellKnownException } from 'src/exceptions/well-known-exception';
import { generateId } from 'src/utils/id-generator';
import { GetMessagesResultDto } from './dtos/get-messages-result.dto';
import { toMessageDto } from 'src/utils/message.mapper';
import { Signal } from 'src/signal/signal';
import { SignalChannel } from 'src/signal/signal.channels';
import { REDIS_CLIENT } from 'src/redis/redis.constants';

const SYNC_LIMIT = 100;

@Injectable()
export class MessageService {
  constructor(
    @InjectRepository(MessageEntity)
    private readonly messageRepository: Repository<MessageEntity>,
    @InjectRepository(ChannelEntity)
    private readonly channelRepository: Repository<ChannelEntity>,
    @InjectRepository(ParticipantEntity)
    private readonly participantRepository: Repository<ParticipantEntity>,
    @Inject(REDIS_CLIENT)
    private readonly redis: Redis,
    private readonly signal: Signal,
  ) {}

  async createMessage(
    userId: string,
    channelId: string,
    content: string,
  ): Promise<MessageEntity> {
    // 채널 참여자인지 확인
    const participant = await this.participantRepository.findOne({
      where: { channelId, userId },
    });
    if (!participant) {
      throw new WellKnownException({
        message: 'Not a participant of this channel',
        errorCode: 'NOT_PARTICIPANT',
      });
    }

    // Redis로 seq 채번
    const seqKey = `channel:${channelId}:seq`;
    const seq = await this.redis.incr(seqKey);

    // 메시지 생성
    const messageId = generateId();
    const message = this.messageRepository.create({
      messageId,
      channelId,
      senderId: userId,
      seq,
      content,
    });
    await this.messageRepository.save(message);

    // channel.lastMessageAt 업데이트
    await this.channelRepository.update(
      { channelId },
      { lastMessageAt: new Date() },
    );

    // sender relation 로드해서 반환
    const messageWithSender = await this.messageRepository.findOne({
      where: { messageId },
      relations: ['sender', 'sender.avatar'],
    });

    // 웹소켓으로 브로드캐스트
    await this.signal.publish(SignalChannel.MESSAGE_NEW, {
      channelId,
      message: toMessageDto(messageWithSender!),
    });

    return messageWithSender!;
  }

  async getMessages(
    userId: string,
    channelId: string,
    options: {
      before?: string;
      after?: string;
      around?: string;
      limit?: number;
    },
  ): Promise<GetMessagesResultDto> {
    // 채널 참여자인지 확인
    const participant = await this.participantRepository.findOne({
      where: { channelId, userId },
    });
    if (!participant) {
      throw new WellKnownException({
        message: 'Not a participant of this channel',
        errorCode: 'NOT_PARTICIPANT',
      });
    }

    const limit = options.limit ?? 50;

    // around인 경우: 해당 메시지 기준 앞뒤로 조회
    if (options.around) {
      const pivotMessage = await this.messageRepository.findOne({
        where: { messageId: options.around, channelId },
      });
      if (!pivotMessage) {
        throw new WellKnownException({
          message: 'Message not found',
          errorCode: 'MESSAGE_NOT_FOUND',
        });
      }

      const halfLimit = Math.floor(limit / 2);

      // pivot 이전 메시지들 (1개 더 가져와서 hasPrev 판단)
      const beforeMessages = await this.messageRepository
        .createQueryBuilder('message')
        .where('message.channelId = :channelId', { channelId })
        .andWhere('message.seq < :seq', { seq: pivotMessage.seq })
        .orderBy('message.seq', 'DESC')
        .take(halfLimit + 1)
        .getMany();

      const hasPrev = beforeMessages.length > halfLimit;
      const actualBeforeMessages = beforeMessages.slice(0, halfLimit);

      // pivot 이후 메시지들 (1개 더 가져와서 hasNext 판단)
      const afterMessages = await this.messageRepository
        .createQueryBuilder('message')
        .where('message.channelId = :channelId', { channelId })
        .andWhere('message.seq > :seq', { seq: pivotMessage.seq })
        .orderBy('message.seq', 'ASC')
        .take(halfLimit + 1)
        .getMany();

      const hasNext = afterMessages.length > halfLimit;
      const actualAfterMessages = afterMessages.slice(0, halfLimit);

      // 합쳐서 seq 순으로 정렬
      const combinedMessages = [
        ...actualBeforeMessages.reverse(),
        pivotMessage,
        ...actualAfterMessages,
      ];

      // sender relation 로드
      const messageIds = combinedMessages.map((m) => m.messageId);
      const messages = await this.messageRepository
        .createQueryBuilder('message')
        .leftJoinAndSelect('message.sender', 'sender')
        .leftJoinAndSelect('sender.avatar', 'avatar')
        .where('message.messageId IN (:...messageIds)', { messageIds })
        .orderBy('message.seq', 'ASC')
        .getMany();

      return { messages, hasNext, hasPrev };
    }

    // before인 경우: 해당 메시지 이전 조회
    if (options.before) {
      const pivotMessage = await this.messageRepository.findOne({
        where: { messageId: options.before, channelId },
      });
      if (!pivotMessage) {
        throw new WellKnownException({
          message: 'Message not found',
          errorCode: 'MESSAGE_NOT_FOUND',
        });
      }

      // 1개 더 가져와서 hasPrev 판단
      const messagesWithExtra = await this.messageRepository
        .createQueryBuilder('message')
        .leftJoinAndSelect('message.sender', 'sender')
        .leftJoinAndSelect('sender.avatar', 'avatar')
        .where('message.channelId = :channelId', { channelId })
        .andWhere('message.seq < :seq', { seq: pivotMessage.seq })
        .orderBy('message.seq', 'DESC')
        .take(limit + 1)
        .getMany();

      const hasPrev = messagesWithExtra.length > limit;
      const messages = messagesWithExtra.slice(0, limit).reverse();

      // hasNext: pivot 이후에 메시지가 있는지 (pivot 자체가 있으니까 true)
      const hasNext = true;

      return { messages, hasNext, hasPrev };
    }

    // after인 경우: 해당 메시지 이후 조회
    if (options.after) {
      const pivotMessage = await this.messageRepository.findOne({
        where: { messageId: options.after, channelId },
      });
      if (!pivotMessage) {
        throw new WellKnownException({
          message: 'Message not found',
          errorCode: 'MESSAGE_NOT_FOUND',
        });
      }

      // 1개 더 가져와서 hasNext 판단
      const messagesWithExtra = await this.messageRepository
        .createQueryBuilder('message')
        .leftJoinAndSelect('message.sender', 'sender')
        .leftJoinAndSelect('sender.avatar', 'avatar')
        .where('message.channelId = :channelId', { channelId })
        .andWhere('message.seq > :seq', { seq: pivotMessage.seq })
        .orderBy('message.seq', 'ASC')
        .take(limit + 1)
        .getMany();

      const hasNext = messagesWithExtra.length > limit;
      const messages = messagesWithExtra.slice(0, limit);

      // hasPrev: pivot 이전에 메시지가 있는지 (pivot 자체가 있으니까 true)
      const hasPrev = true;

      return { messages, hasNext, hasPrev };
    }

    // 기본: 최신 메시지부터
    // 1개 더 가져와서 hasPrev 판단
    const messagesWithExtra = await this.messageRepository
      .createQueryBuilder('message')
      .leftJoinAndSelect('message.sender', 'sender')
      .leftJoinAndSelect('sender.avatar', 'avatar')
      .where('message.channelId = :channelId', { channelId })
      .orderBy('message.seq', 'DESC')
      .take(limit + 1)
      .getMany();

    const hasPrev = messagesWithExtra.length > limit;
    const messages = messagesWithExtra.slice(0, limit).reverse();

    // hasNext: 최신부터 가져왔으니 다음은 없음
    const hasNext = false;

    return { messages, hasNext, hasPrev };
  }

  async syncMessages(
    userId: string,
    channelId: string,
    since: Date,
  ): Promise<{
    created: MessageEntity[];
    updated: MessageEntity[];
    deleted: string[];
    requireFullSync: boolean;
  }> {
    // 채널 참여자인지 확인
    const participant = await this.participantRepository.findOne({
      where: { channelId, userId },
    });
    if (!participant) {
      throw new WellKnownException({
        message: 'Not a participant of this channel',
        errorCode: 'NOT_PARTICIPANT',
      });
    }

    // since 이후 변경된 메시지 조회 (삭제된 것 포함)
    const messages = await this.messageRepository
      .createQueryBuilder('message')
      .withDeleted()
      .leftJoinAndSelect('message.sender', 'sender')
      .leftJoinAndSelect('sender.avatar', 'avatar')
      .where('message.channelId = :channelId', { channelId })
      .andWhere('message.updatedAt > :since', { since })
      .orderBy('message.seq', 'ASC')
      .getMany();

    // 변경량 체크
    if (messages.length > SYNC_LIMIT) {
      return { created: [], updated: [], deleted: [], requireFullSync: true };
    }

    // 분류
    const created = messages.filter((m) => m.createdAt > since && !m.deletedAt);
    const updated = messages.filter(
      (m) => m.createdAt <= since && !m.deletedAt,
    );
    const deleted = messages
      .filter((m) => m.deletedAt !== null)
      .map((m) => m.messageId);

    return { created, updated, deleted, requireFullSync: false };
  }
}
