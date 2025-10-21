import { DynamicModule, Global, Inject, Module, Provider } from "@nestjs/common";
import Redis, { RedisOptions } from "ioredis";

const REDIS_DEFAULT = 'default';
const getRedisToken = (name = REDIS_DEFAULT) => `REDIS_CLIENT:${name}`;

@Global()
@Module({})
class RedisCoreModule {
  static forRootAsync(opts: {
    name?: string;
    useFactory: (...args: any[]) => RedisOptions | Promise<RedisOptions>;
    inject?: any[];
  }) {
    const name = opts.name ?? REDIS_DEFAULT;
    const token = getRedisToken(name);

    const clientProvider: Provider = {
      provide: token,
      useFactory: async (...args: any[]) => {
        const options = await opts.useFactory(...args);
        const client = new Redis(options);
        console.log(`[Redis:${name}] Connected to Redis at ${options.host}:${options.port}`);
        client.on('error', (e) => console.error(`[Redis:${name}]`, e));
        return client;
      },
      inject: opts.inject ?? [],
    };

    return {
      module: RedisCoreModule,
      providers: [clientProvider],
      exports: [clientProvider],
      global: true,
    };
  }
}

@Module({})
export class RedisModule {
  static forRootAsync(opts: {
    name?: string;
    useFactory: (...args: any[]) => RedisOptions | Promise<RedisOptions>;
    inject?: any[];
  }): DynamicModule {
    return {
      module: RedisModule,
      imports: [RedisCoreModule.forRootAsync(opts)],
    }
  }

  static forFeature(_names: string[] = [REDIS_DEFAULT]): DynamicModule {
    return { module: RedisModule };
  }
}

export const InjectRedis = (name = REDIS_DEFAULT) => Inject(getRedisToken(name));