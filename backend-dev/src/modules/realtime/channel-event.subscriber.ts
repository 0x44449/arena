import { REDIS_SUB } from "@/libs/redis/redis-provide-symbol";
import { InjectRedis } from "@/libs/redis/redis.module";
import { Injectable, OnModuleInit } from "@nestjs/common";
import Redis from "ioredis";
import { ChannelEventGateway } from "./channel-event.gateway";
import { EnvelopeSchema } from "./schemas/envelop.schema";

@Injectable()
export class ChannelEventSubscriber implements OnModuleInit {
  constructor(
    @InjectRedis(REDIS_SUB) private readonly sub: Redis,
    private readonly gateway: ChannelEventGateway,
  ) {}

  private handlers: Record<string, (channelId: string, payload: any) => Promise<void> | void> = {
    "channel:join": async (channelId: string, payload: any) => {
      this.gateway.broadcastToChannel(channelId, "channel:join", payload);
    },
    "channel:leave": async (channelId: string, payload: any) => {
      this.gateway.broadcastToChannel(channelId, "channel:leave", payload);
    },
    "chat:message": async (channelId: string, payload: any) => {
      this.gateway.broadcastToChannel(channelId, "chat:message", payload);
    },
    "live:join": async (channelId: string, payload: any) => {
      this.gateway.broadcastToChannel(channelId, "live:join", payload);
    },
    "live:leave": async (channelId: string, payload: any) => {
      this.gateway.broadcastToChannel(channelId, "live:leave", payload);
    },
  };

  async onModuleInit() {
    await this.sub.psubscribe("channel:*", "chat:*", "live:*");
    this.sub.on("pmessage", async (pattern: string, channel: string, message: string) => {
      try {
        const env = EnvelopeSchema.parse(JSON.parse(message));

        const dedupleKey = `channel_event_dedup:${env.id}`;
        const isNew = await this.sub.set(dedupleKey, "1", "PX", 60 * 1000, "NX");
        if (!isNew) {
          // Duplicate event, ignore
          return;
        }

        const handler = this.handlers[channel];
        if (!handler) {
          console.warn(`No handler for channel event: ${channel}`);
          return;
        }
        await handler(env.channelId, env.data);
      } catch (e) {
        console.error("ChannelEventSubscriber pmessage handler error:", e);
      }
    });
  }
}