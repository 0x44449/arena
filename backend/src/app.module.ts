import { Module } from '@nestjs/common';
import { UsersModule } from './modules/users/users.module';
import { ConfigModule } from '@nestjs/config';
import { FilesModule } from './modules/files/files.module';
import { TeamsModule } from './modules/teams/teams.module';
import { ArenaOrmModule } from './arena-orm.module';
import { WorkspacesModule } from './modules/workspaces/workspaces.module';
import { ChatModule } from './modules/chat/chat.module';
import { RedisModule } from './redis.module';
import { AuthModule } from './modules/auth/auth.module';
import { ArenaJwtModule } from './arena-jwt.module';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './guards/auth.guard';

@Module({
  imports: [
    ConfigModule.forRoot(),
    ArenaOrmModule.forTypeOrm(),
    ArenaJwtModule.register(),
    RedisModule,
    UsersModule,
    FilesModule,
    TeamsModule,
    WorkspacesModule,
    ChatModule,
    AuthModule,
  ]
})
export class AppModule {}
