import { Module } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { VaultController } from './vault/vault.controller';
import { ZoneController } from './zone/zone.controller';
import { ChatGateway } from './chat/chat.gateway';
import { ChatController } from './chat/chat.controller';
import { VaultService } from './vault/vault.service';
import { ZoneService } from './zone/zone.service';
import { UserService } from './user/user.service';
import { ChatService } from './chat/chat.service';

@Module({
  imports: [],
  controllers: [VaultController, ZoneController, ChatController],
  providers: [ChatGateway, ChatService, PrismaClient, VaultService, ZoneService, UserService],
})
export class AppModule {}
