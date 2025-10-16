import { Module } from '@nestjs/common';
import { TeamController } from './team.controller';
import { TeamService } from './team.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TeamEntity } from '@/entities/team.entity';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([TeamEntity]), AuthModule],
  controllers: [TeamController],
  providers: [TeamService],
})
export class TeamModule {}