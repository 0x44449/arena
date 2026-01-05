import { Module } from '@nestjs/common';
import { ArenaGateway } from './arena.gateway';
import { WsJwtAuthGuard } from 'src/guards/ws-jwt-auth.guard';

@Module({
  providers: [ArenaGateway, WsJwtAuthGuard],
  exports: [ArenaGateway],
})
export class GatewayModule {}
