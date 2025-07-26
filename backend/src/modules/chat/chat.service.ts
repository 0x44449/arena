import { InjectRedis } from "@/decorators/inject-redis.decorator";
import { ChatMessageEntity } from "@/entities/chat-message.entity";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import Redis from "ioredis";
import { Repository, LessThan, MoreThan, FindOptionsOrder, FindOptionsWhere } from "typeorm";
import { CreateChatMessageDto } from "./dtos/create-chat-message.dto";
import { UserEntity } from "@/entities/user.entity";
import { FileEntity } from "@/entities/file.entity";
import { InfinityPagedDto } from "@/dtos/infinity-paged.dto";
import { ChatGateway } from "./chat.gateway";

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(ChatMessageEntity) private readonly chatMessageRepository: Repository<ChatMessageEntity>,
    @InjectRepository(FileEntity) private readonly fileRepository: Repository<FileEntity>,
    @InjectRedis() private readonly redis: Redis,
    private readonly chatGateway: ChatGateway
  ) {}

  async getPagedMessagesByChannelId(channelId: string, baseSeq: number, limit: number, direction: 'prev' | 'next'): Promise<InfinityPagedDto<ChatMessageEntity>> {
    let hasNext = false;
    let hasPrev = false;

    const whereCondition: FindOptionsWhere<ChatMessageEntity> =
      direction === 'prev'
        ? baseSeq === -1
          ? { channelId }
          : { channelId, seq: LessThan(baseSeq) }
        : { channelId, seq: MoreThan(baseSeq) };

    // 정렬 순서 분기
    const orderCondition: FindOptionsOrder<ChatMessageEntity> =
      direction === 'prev'
        ? { seq: 'DESC' }  // base 바로 이전 메시지부터, 오래된 순으로
        : { seq: 'ASC' };  // base 바로 다음 메시지부터, 최신 순으로

    const messages = await this.chatMessageRepository.find({
      where: whereCondition,
      order: orderCondition,
      take: limit,
      relations: ['sender', 'attachments'],
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
    if (direction === 'prev') {
      messages.reverse(); // prev는 오래된 순으로 정렬되어야 하므로 역순으로
    }

    return {
      items: messages,
      hasNext,
      hasPrev,
    };
  }

  async createMessage(channelId: string, param: CreateChatMessageDto, sender: UserEntity): Promise<ChatMessageEntity> {
    const attachments = param.attachementIds ? this.fileRepository.create(param.attachementIds.map(id => ({ fileId: id }))) : [];
    const incrKey = `chat:channel:${channelId}:seq`;

    // 메세지 SEQ값 채번, 0부터 시작
    const exists = await this.redis.exists(incrKey);
    if (!exists) {
      const last = await this.chatMessageRepository.findOne({
        where: { channelId },
        order: { seq: 'DESC' },
        select: ['seq']
      });
      const lastSeq = last ? last.seq : -1;
      await this.redis.set(incrKey, lastSeq);
    }
    const seq = await this.redis.incr(incrKey);

    const message = this.chatMessageRepository.create({
      seq,
      channelId,
      message: param.message,
      senderId: sender.userId,
      attachments,
    });

    await this.chatMessageRepository.save(message);
    const saved = await this.chatMessageRepository.findOne({
      where: { messageId: message.messageId },
      relations: ['sender', 'attachments'],
    });

    if (!saved) {
      throw new Error("Failed to save chat message");
    }

    // 메세지 생성 알림
    this.chatGateway.notifyMessage(channelId, saved);

    return saved;
  }
}