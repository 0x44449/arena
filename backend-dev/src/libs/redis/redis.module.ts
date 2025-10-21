import { DynamicModule, Inject, Module, OnApplicationShutdown, Provider } from "@nestjs/common";
import Redis, { RedisOptions } from "ioredis";

const REDIS_DEFAULT = 'default';
const getRedisToken = (name = REDIS_DEFAULT) => `REDIS_CLIENT:${name}`;

class RedisClientHolder implements OnApplicationShutdown {
  constructor(
    public readonly name: string,
    public readonly client: Redis
  ) {}

  async onApplicationShutdown() {
    try {
      await this.client.quit();
    }
    catch (err) {
      // ignore
    }
  }
}

@Module({})
class RedisCoreModule {
  static forRoot(options: RedisOptions, name?: string) {
    const redisName = name || REDIS_DEFAULT;
    const token = getRedisToken(redisName);

    const clientProvider: Provider = {
      provide: token,
      useFactory: async () => {
        const client = new Redis(options);
        client.on("error", (err) => console.error(`Redis Client (${redisName}) Error:`, err));
        return client;
      }
    }

    const holderProvider: Provider = {
      provide: `${token}:HOLDER`,
      useFactory: (client: Redis) => new RedisClientHolder(redisName, client),
      inject: [token],
    }

    return {
      module: RedisCoreModule,
      providers: [clientProvider, holderProvider],
      exports: [clientProvider],
    }
  }

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
        client.on('error', (e) => console.error(`[Redis:${name}]`, e));
        return client;
      },
      inject: opts.inject ?? [],
    };

    const holderProvider: Provider = {
      provide: `${token}:HOLDER`,
      useFactory: (client: Redis) => new RedisClientHolder(name, client),
      inject: [token],
    };

    return {
      module: RedisCoreModule,
      providers: [clientProvider, holderProvider],
      exports:   [clientProvider],
    };
  }
}

@Module({})
class RedisFeatureModule {
  static register(name: string[]) {
    const aliasProviders: Provider[] = name.map((n) => ({
      provide: getRedisToken(n),
      useExisting: getRedisToken(n),
    }));

    return {
      module: RedisFeatureModule,
      imports: [RedisCoreModule],
      providers: aliasProviders,
      exports: aliasProviders,
    }
  }
}

@Module({})
export class RedisModule {
  static forRoot(options: RedisOptions, name?: string): DynamicModule {
    return {
      module: RedisModule,
      imports: [RedisCoreModule.forRoot(options, name)],
      exports: [RedisCoreModule],
    }
  }

  static forRootAsync(opts: {
    name?: string;
    useFactory: (...args: any[]) => RedisOptions | Promise<RedisOptions>;
    inject?: any[];
  }): DynamicModule {
    return {
      module: RedisModule,
      imports: [RedisCoreModule.forRootAsync(opts)],
      exports: [RedisCoreModule],
    }
  }

  static forFeature(names: string[] = [REDIS_DEFAULT]): DynamicModule {
    return {
      module: RedisModule,
      imports: [RedisFeatureModule.register(names)],
      exports: [RedisFeatureModule],
    }
  }
}

export const InjectRedis = (name = REDIS_DEFAULT) => Inject(getRedisToken(name));