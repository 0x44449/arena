import { Inject, Injectable, OnModuleInit } from "@nestjs/common";
import Redis from "ioredis";
import { REDIS_CLIENT, REDIS_SUBSCRIBER } from "src/redis/redis.constants";
import { SignalChannelType, SignalPayloadMap } from "./signal.channels";

type SignalHandler<T> = (data: T) => void | Promise<void>;

@Injectable()
export class Signal implements OnModuleInit {
  private handlers = new Map<string, SignalHandler<unknown>[]>();

  constructor(
    @Inject(REDIS_CLIENT)
    private readonly publisher: Redis,
    @Inject(REDIS_SUBSCRIBER)
    private readonly subscriber: Redis,
  ) {}

  onModuleInit() {
    this.subscriber.on("message", async (channel, data) => {
      const handlers = this.handlers.get(channel);
      if (handlers) {
        const parsed = JSON.parse(data);
        for (const handler of handlers) {
          await handler(parsed);
        }
      }
    });
  }

  async publish<C extends SignalChannelType>(
    channel: C,
    data: SignalPayloadMap[C],
  ): Promise<void> {
    await this.publisher.publish(channel, JSON.stringify(data));
  }

  subscribe<C extends SignalChannelType>(
    channel: C,
    handler: SignalHandler<SignalPayloadMap[C]>,
  ): void {
    this.subscriber.subscribe(channel);

    const existing = this.handlers.get(channel) || [];
    existing.push(handler as SignalHandler<unknown>);
    this.handlers.set(channel, existing);
  }
}
