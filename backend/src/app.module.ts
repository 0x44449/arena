import { Module } from '@nestjs/common';
import { UsersModule } from './modules/users/users.module';
import { ConfigModule } from '@nestjs/config';
import { FilesModule } from './modules/files/files.module';
import { TeamsModule } from './modules/teams/teams.module';
import { ArenaOrmModule } from './arena-orm.module';
import { ChannelsModule } from './modules/channels/channels.module';
import { ChatModule } from './modules/chat/chat.module';
import { RedisModule } from './redis.module';
import { AuthModule } from './modules/auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    ArenaOrmModule.forTypeOrm(),
    RedisModule,
    UsersModule,
    FilesModule,
    TeamsModule,
    ChannelsModule,
    ChatModule,
    AuthModule,
  ]
})
export class AppModule {}
