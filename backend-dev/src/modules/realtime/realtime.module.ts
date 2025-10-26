import { RedisModule } from "@/libs/redis/redis.module";
import { Module } from "@nestjs/common";
import { ChannelEventGateway } from "./channel-event.gateway";
import { ChannelEventPublisher } from "./channel-event.publisher";
import { ChannelEventSubscriber } from "./channel-event.subscriber";
import { AuthModule } from "../auth/auth.module";

@Module({
  imports: [RedisModule.forFeature(), AuthModule],
  providers: [ChannelEventGateway, ChannelEventPublisher, ChannelEventSubscriber],
  exports: [ChannelEventPublisher],
})
export class RealtimeModule {}