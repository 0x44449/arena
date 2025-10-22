import { Module } from '@nestjs/common';
import { UserModule } from './modules/user/user.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TeamModule } from './modules/team/team.module';
import { ChannelModule } from './modules/channel/channel.module';
import { AuthModule } from './modules/auth/auth.module';
import { RedisModule } from './libs/redis/redis.module';
import { ChatModule } from './modules/chat/chat.module';
import { FileModule } from './modules/file/file.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: "postgres",
        host: configService.get<string>('DATABASE_HOST'),
        port: parseInt(configService.get<string>('DATABASE_PORT') || '5432', 10),
        username: configService.get<string>('DATABASE_USERNAME'),
        password: configService.get<string>('DATABASE_PASSWORD'),
        database: configService.get<string>('DATABASE_NAME'),
        synchronize: true,
        logging: false,
      }),
      inject: [ConfigService],
    }),
    RedisModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        host: configService.get('REDIS_HOST') || 'redis',
        port: Number(configService.get('REDIS_PORT') || 6379),
        password: configService.get('REDIS_PASSWORD'),
        db: 0,
      }),
      inject: [ConfigService],
    }),
    AuthModule,
    TeamModule,
    ChannelModule,
    UserModule,
    ChatModule,
    FileModule,
  ],
})
export class AppModule {}
