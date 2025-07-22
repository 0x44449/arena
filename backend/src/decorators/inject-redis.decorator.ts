import { REDIS } from '@/redis.module';
import { Inject } from '@nestjs/common';

export const InjectRedis = () => Inject(REDIS);