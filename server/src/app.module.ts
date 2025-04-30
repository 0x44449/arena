import { Module } from '@nestjs/common';
import { UserService } from './user/user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TeamService } from './team/team.service';
import { WorkspaceService } from './workspace/workspace.service';
import { TeamController } from './team/team.controller';
import { WorkspaceController } from './workspace/workspace.controller';
import { UserEntity } from './entity/user.entity';
import { TeamEntity } from './entity/team.entity';
import { WorkspaceEntity } from './entity/workspace.entity';
import { ChatMessageEntity } from './entity/chat-message.entity';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { WorkspaceFeatureEntity } from './entity/workspace-feature.entity';
import { ChatService } from './chat/chat.service';
import { ChatGateway } from './chat/chat.gateway';
import { ChatController } from './chat/chat.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST'),
        port: parseInt(configService.get<string>('DB_PORT') || '5432', 10),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_DATABASE'),
        entities: [__dirname + '/entity/*.entity.{ts,js}'],
        synchronize: true, // 개발용: 엔티티 변경 시 DB 자동 싱크
        logging: false, // 개발 중 SQL 로그 보기
      }),
    }),
    TypeOrmModule.forFeature([
      UserEntity,
      TeamEntity,
      WorkspaceEntity,
      WorkspaceFeatureEntity,
      ChatMessageEntity,
    ])
  ],
  controllers: [TeamController, WorkspaceController, ChatController],
  providers: [UserService, TeamService, WorkspaceService, ChatService, ChatGateway],
})
export class AppModule {}
