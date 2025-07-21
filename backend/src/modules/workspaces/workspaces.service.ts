import { WorkspaceEntity } from "@/entities/workspace.entity";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CreateWorkspaceDto } from "./dto/create-workspace.dto";
import { UserEntity } from "@/entities/user.entity";
import { idgen } from "@/commons/id-generator";

@Injectable()
export class WorkspacesService {
  constructor(
    @InjectRepository(WorkspaceEntity) private readonly workspacesRepository: Repository<WorkspaceEntity>,
  ) {}

  async createWorkspace(param: CreateWorkspaceDto, owner: UserEntity): Promise<WorkspaceEntity> {
    const workspace = this.workspacesRepository.create({
      workspaceId: idgen.shortId(),
      name: param.name,
      description: param.description,
      teamId: param.teamId,
      ownerId: owner.userId,
    });

    return await this.workspacesRepository.save(workspace);
  }

  async findWorkspaceByWorkspaceId(workspaceId: string): Promise<WorkspaceEntity> {
    const workspace = await this.workspacesRepository.findOne({
      where: { workspaceId },
      relations: ['owner', 'team'],
    });

    if (!workspace) {
      throw new Error(`Workspace with ID ${workspaceId} not found`);
    }

    return workspace;
  }

  async findWorkspacesByTeamId(teamId: string): Promise<WorkspaceEntity[]> {
    return this.workspacesRepository.find({
      where: { teamId },
      relations: ['owner', 'team'],
    });
  }
}