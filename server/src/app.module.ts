import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { PrismaClient } from '@prisma/client';
import { VaultController } from './vault/vault.controller';
import { ZoneController } from './zone/zone.controller';
import { ChatGateway } from './chat/chat.gateway';
import { ChatController } from './chat/chat.controller';

@Module({
  imports: [],
  controllers: [VaultController, ZoneController, ChatController],
  providers: [AppService, ChatGateway, PrismaClient], // TODO: PrismaClient는 나중에 PrismaService로 리팩토링
})
export class AppModule {}
