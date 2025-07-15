import { Module } from '@nestjs/common';
import { UsersModule } from './modules/users/users.module';
import { ConfigModule } from '@nestjs/config';
import { FilesModule } from './modules/files/files.module';
import { TeamsModule } from './modules/teams/teams.module';
import { ArenaOrmModule } from './arena-orm.module';
import { WorkspacesModule } from './modules/workspaces/workspaces.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    ArenaOrmModule.forTypeOrm(),
    UsersModule,
    FilesModule,
    TeamsModule,
    WorkspacesModule
  ],
})
export class AppModule {}
