import { Module, Global } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

export const REDIS = Symbol('REDIS');

@Global()
@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: REDIS,
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        return new Redis({
          host: config.get('REDIS_HOST') || 'redis',
          port: Number(config.get('REDIS_PORT') || 6379),
          password: config.get('REDIS_PASSWORD'),
        });
      },
    },
  ],
  exports: [REDIS],
})
export class RedisModule {}