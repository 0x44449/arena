import { WorkspaceEntity } from "@/entities/workspace.entity";
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { WorkspacesController } from "./workspaces.controller";
import { WorkspacesService } from "./workspaces.service";
import { TeamEntity } from "@/entities/team.entity";
import { UserEntity } from "@/entities/user.entity";

@Module({
  imports: [TypeOrmModule.forFeature([TeamEntity, WorkspaceEntity, UserEntity])],
  controllers: [WorkspacesController],
  providers: [WorkspacesService],
  exports: [TypeOrmModule],
})
export class WorkspacesModule {}