import { UserDto } from "@/dtos/user.dto";
import { REDIS_PUB } from "@/libs/redis/redis-provide-symbol";
import { InjectRedis } from "@/libs/redis/redis.module";
import { Injectable } from "@nestjs/common";
import Redis from "ioredis";
import { createEnvelope } from "./schemas/envelop.schema";
import { ChatMessageDto } from "@/dtos/chat-message.dto";

@Injectable()
export class ChannelEventPublisher {
  constructor(
    @InjectRedis(REDIS_PUB) private readonly pub: Redis,
  ) {}

  join(channelId: string, payload: UserDto) {
    const env = createEnvelope("channel:join", channelId, payload);
    return this.pub.publish(`channel:join:${channelId}`, JSON.stringify(env));
  }

  leave(channelId: string, payload: UserDto) {
    const env = createEnvelope("channel:leave", channelId, payload);
    return this.pub.publish(`channel:leave:${channelId}`, JSON.stringify(env));
  }

  sendMessage(channelId: string, payload: ChatMessageDto) {
    const env = createEnvelope("chat:message", channelId, payload);
    return this.pub.publish(`chat:message:${channelId}`, JSON.stringify(env));
  }

  liveJoin(channelId: string, payload: UserDto) {
    const env = createEnvelope("live:join", channelId, payload);
    return this.pub.publish(`live:join:${channelId}`, JSON.stringify(env));
  }

  liveLeave(channelId: string, payload: UserDto) {
    const env = createEnvelope("live:leave", channelId, payload);
    return this.pub.publish(`live:leave:${channelId}`, JSON.stringify(env));
  }
}