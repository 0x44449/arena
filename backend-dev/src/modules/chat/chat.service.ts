import { ChatMessageEntity } from "@/entities/chat-message.entity";
import { InjectRedis } from "@/libs/redis/redis.module";
import { Injectable, OnModuleInit } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import Redis from "ioredis";
import { FindOptionsOrder, FindOptionsWhere, LessThan, MoreThan, Repository } from "typeorm";
import { CreateChatMessageDto } from "./dtos/create-chat-message.dto";
import { UserEntity } from "@/entities/user.entity";
import { InfinityPagedDto } from "@/dtos/infinity-paged.dto";
import { WellKnownError } from "@/exceptions/well-known-error";
import { ChannelEventPublisher } from "../realtime/channel-event.publisher";
import { ChatMessageDto } from "@/dtos/chat-message.dto";

interface RedisEx extends Redis {
  initMaxAndIncr(key: string, dbmax: number, doIncr: number): Promise<number>;
}

@Injectable()
export class ChatService implements OnModuleInit {
  constructor(
    @InjectRepository(ChatMessageEntity) private readonly chatMessageRepository: Repository<ChatMessageEntity>,
    @InjectRedis() private readonly redis: RedisEx,
    private readonly channelPub: ChannelEventPublisher,
  ) {}

  onModuleInit() {
    this.redis.defineCommand("initMaxAndIncr", {
      numberOfKeys: 1,
      lua: `
        local k = KEYS[1]
        local dbmax = tonumber(ARGV[1])
        local doIncr = tonumber(ARGV[2])

        local cur = redis.call('GET', k)
        if not cur then
          redis.call('SET', k, dbmax)
        else
          local c = tonumber(cur)
          if c < dbmax then
            redis.call('SET', k, dbmax)
          end
        end

        if doIncr == 1 then
          return redis.call('INCR', k)
        else
          return tonumber(redis.call('GET', k))
        end
      `,
    })
  }

  async createMessage(channelId: string, param: CreateChatMessageDto, sender: UserEntity): Promise<ChatMessageEntity> {
    const seqKey = `chat:channel:${channelId}:seq`;
    let seq = -1;

    const redisKeyExists = await this.redis.exists(seqKey);
    if (redisKeyExists) {
      seq = await this.redis.incr(seqKey);
    }
    else {
      const last = await this.chatMessageRepository.findOne({
        where: { channelId },
        order: { seq: "DESC" },
        select: ["seq"],
      });

      const lastSeq = last ? last.seq : -1;
      seq = await this.redis.initMaxAndIncr(seqKey, lastSeq, 1);
    }

    const message = this.chatMessageRepository.create({
      channelId,
      seq,
      message: param.message,
      sender,
    });

    await this.chatMessageRepository.save(message);
    const created = await this.chatMessageRepository.findOne({
      where: { channelId, seq },
      relations: ['sender', 'attachments', 'attachments.uploader'],
    });

    if (!created) {
      throw new WellKnownError({
        message: "Failed to create chat message",
        errorCode: "CHAT_MESSAGE_CREATION_FAILED",
      });
    }
    this.channelPub.sendMessage(channelId, ChatMessageDto.fromEntity(created));
    return created;
  }

  async getPagedMessages(
    channelId: string,
    param: {
      baseSeq: number;
      limit: number;
      direction: 'next' | 'prev';
    }
  ): Promise<InfinityPagedDto<ChatMessageEntity>> {
    let hasNext = false;
    let hasPrev = false;

    const whereCondition: FindOptionsWhere<ChatMessageEntity> =
      param.direction === 'prev'
        ? param.baseSeq === -1
          ? { channelId }
          : { channelId, seq: LessThan(param.baseSeq) }
        : { channelId, seq: MoreThan(param.baseSeq) };

    const orderCondition: FindOptionsOrder<ChatMessageEntity> =
      param.direction === 'prev'
        ? { seq: 'DESC' }  // base 바로 이전 메시지부터, 오래된 순으로
        : { seq: 'ASC' };  // base 바로 다음 메시지부터, 최신 순으로

    const messages = await this.chatMessageRepository.find({
      where: whereCondition,
      order: orderCondition,
      take: param.limit,
      relations: ['sender', 'attachments', 'attachments.uploader'],
    });

    // Next/Prev 여부 판단
    if (messages.length === 0) {
      hasPrev = false;
      hasNext = false;
    } else {
      const seqs = messages.map(m => m.seq);
      const minSeq = Math.min(...seqs);
      const maxSeq = Math.max(...seqs);

      // Next/Prev 여부 확인 쿼리
      const [hasPrevResult, hasNextResult] = await Promise.all([
        this.chatMessageRepository.exists({
          where: { channelId, seq: LessThan(minSeq) },
        }),
        this.chatMessageRepository.exists({
          where: { channelId, seq: MoreThan(maxSeq) },
        }),
      ]);
      hasPrev = hasPrevResult;
      hasNext = hasNextResult;
    }

    // 메시지 순서 보정
    if (param.direction === 'prev') {
      messages.reverse(); // prev는 오래된 순으로 정렬되어야 하므로 역순으로
    }

    return {
      items: messages,
      hasNext,
      hasPrev,
    };
  }
}