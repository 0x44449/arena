import { Module } from '@nestjs/common';
import { UserModule } from './modules/user/user.module';
import { DeviceModule } from './modules/device/device.module';
import { FileModule } from './modules/file/file.module';
import { ChannelModule } from './modules/channel/channel.module';
import { MessageModule } from './modules/message/message.module';
import { ContactModule } from './modules/contact/contact.module';
import { GatewayModule } from './modules/gateway/gateway.module';
import { ArenaAuthModule } from './auth/arena-auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { buildDataSourceOptions } from './database/typeorm.config';
import { RedisModule } from './redis/redis.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    RedisModule,
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const port = configService.get<string>('DB_PORT');
        return buildDataSourceOptions({
          host: configService.get<string>('DB_HOST'),
          port: port ? Number(port) : undefined,
          username: configService.get<string>('DB_USER'),
          password: configService.get<string>('DB_PASSWORD'),
          database: configService.get<string>('DB_NAME'),
        });
      },
    }),
    ArenaAuthModule,
    UserModule,
    DeviceModule,
    FileModule,
    ChannelModule,
    MessageModule,
    ContactModule,
    GatewayModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
