import { ChatMessageEntity } from "@/entities/chat-message.entity";
import { InjectRedis } from "@/libs/redis/redis.module";
import { Injectable, OnModuleInit } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import Redis from "ioredis";
import { Repository } from "typeorm";
import { CreateChatMessageDto } from "./dtos/create-chat-message.dto";
import { UserEntity } from "@/entities/user.entity";

interface RedisEx extends Redis {
  initMaxAndIncr(key: string, dbmax: number, doIncr: number): Promise<number>;
}

@Injectable()
export class ChatService implements OnModuleInit {
  constructor(
    @InjectRepository(ChatMessageEntity) private readonly chatMessageRepository: Repository<ChatMessageEntity>,
    @InjectRedis() private readonly redis: RedisEx,
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
    
    const created = await this.chatMessageRepository.save(message);
    return created;
  }
}