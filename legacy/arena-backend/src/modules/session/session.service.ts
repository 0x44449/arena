import { Inject, Injectable, OnModuleInit, forwardRef } from '@nestjs/common';
import Redis from 'ioredis';
import { REDIS_CLIENT } from 'src/redis/redis.constants';
import { Signal } from 'src/signal/signal';
import { SignalChannel } from 'src/signal/signal.channels';
import { UserService } from '../user/user.service';
import { CachedUser } from './session.types';

const SESSION_PREFIX = 'session:';
const SESSION_TTL = 300; // 5분

@Injectable()
export class SessionService implements OnModuleInit {
  constructor(
    @Inject(REDIS_CLIENT)
    private readonly redis: Redis,
    private readonly signal: Signal,
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
  ) {}

  onModuleInit() {
    this.signal.subscribe(SignalChannel.USER_UPDATED, async ({ uid }) => {
      await this.invalidate(uid);
    });
  }

  async getOrFetch(uid: string): Promise<CachedUser | null> {
    // 1. 캐시에서 조회
    let cachedUser = await this.get(uid);

    // 2. 캐시 미스 → DB 조회 후 캐싱
    if (!cachedUser) {
      const userEntity = await this.userService.findByUid(uid);
      if (userEntity) {
        cachedUser = {
          userId: userEntity.userId,
          uid: userEntity.uid,
          utag: userEntity.utag,
          nick: userEntity.nick,
          email: userEntity.email,
        };
        await this.set(cachedUser);
      }
    }

    return cachedUser;
  }

  async get(uid: string): Promise<CachedUser | null> {
    const key = this.getKey(uid);
    const data = await this.redis.get(key);
    if (!data) {
      return null;
    }
    return JSON.parse(data) as CachedUser;
  }

  async set(user: CachedUser): Promise<void> {
    const key = this.getKey(user.uid);
    await this.redis.set(key, JSON.stringify(user), 'EX', SESSION_TTL);
  }

  async invalidate(uid: string): Promise<void> {
    const key = this.getKey(uid);
    await this.redis.del(key);
  }

  private getKey(uid: string): string {
    return `${SESSION_PREFIX}${uid}`;
  }
}
