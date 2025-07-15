import { Module } from "@nestjs/common";
import { TeamsController } from "./teams.controller";
import { TeamsService } from "./teams.service";
import { TeamEntity } from "@/entities/team.entity";
import { UserEntity } from "@/entities/user.entity";
import { TypeOrmModule } from "@nestjs/typeorm";
import { WorkspaceEntity } from "@/entities/workspace.entity";

@Module({
  imports: [TypeOrmModule.forFeature([TeamEntity, WorkspaceEntity, UserEntity])],
  controllers: [TeamsController],
  providers: [TeamsService],
  exports: [TypeOrmModule],
})
export class TeamsModule {}