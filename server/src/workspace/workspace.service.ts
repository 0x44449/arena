import { WorkspaceEntity } from "@/entity/workspace.entity";
import { UserService } from "@/user/user.service";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CreateWorkspaceDto } from "./dto/create-workspace.dto";
import { WorkspaceDto } from "@/dto/workspace.dto";
import { PublicUserDto } from "@/dto/public-user.dto";
import { UpdateWorkspaceDto } from "./dto/update-workspace.dto";
import { nanoid } from "nanoid";
import { CreateWorkspaceFeatureDto } from "./dto/create-workspace-feature.dto";
import { WorkspaceFeatureDto } from "@/dto/workspace-feature.dto";
import { WorkspaceFeatureEntity } from "@/entity/workspace-feature.entity";

@Injectable()
export class WorkspaceService {
  constructor(
    @InjectRepository(WorkspaceEntity)
    private readonly workspaceRepository: Repository<WorkspaceEntity>,
    @InjectRepository(WorkspaceFeatureEntity)
    private readonly workspaceFeatureRepository: Repository<WorkspaceFeatureEntity>,
    private readonly userService: UserService
  ) {}

  async createWorkspace(param: CreateWorkspaceDto, teamId: string, creatorId: string): Promise<WorkspaceDto> {
    const { name, description } = param;
    if (!name || !description) {
      throw new Error("Name and description are required");
    }

    // TODO: 권한처리
    // Workspace 생성
    const workspace = await this.workspaceRepository.save<Partial<WorkspaceEntity>>({
      workspaceId: nanoid(12),
      teamId,
      name,
      description,
      ownerId: creatorId,
    });
    if (!workspace) {
      throw new Error("Failed to create workspace");
    }
    const workspaceDto = new WorkspaceDto(workspace);

    // User 매핑
    const user = await this.userService.getUserByUserId(creatorId);
    if (user) {
      workspaceDto.owner = new PublicUserDto(user);
    }

    return workspaceDto;
  }

  async updateWorkspace(param: UpdateWorkspaceDto, workspaceId: string, updaterId: string): Promise<WorkspaceDto | null> {
    const { name, description } = param;
    if (!name || !description) {
      throw new Error("Name and description are required");
    }

    // TODO: 권한처리
    // Workspace 업데이트
    await this.workspaceRepository.update(
      { workspaceId },
      { name, description }
    );
    const workspace = await this.workspaceRepository.findOne({
      where: { workspaceId }
    });
    if (!workspace) return null;

    const workspaceDto = new WorkspaceDto(workspace);

    // User 매핑
    const user = await this.userService.getUserByUserId(updaterId);
    if (user) {
      workspaceDto.owner = new PublicUserDto(user);
    }

    return workspaceDto;
  }

  async deleteWorkspace(workspaceId: string, deleterId: string): Promise<void> {
    // TODO: 권한처리
    const workspace = await this.workspaceRepository.findOne({
      where: { workspaceId, ownerId: deleterId },
    });
    if (!workspace) return;

    await this.workspaceRepository.delete(workspaceId);
  }

  async getWorkspaceByWorkspaceId(workspaceId: string): Promise<WorkspaceDto | null> {
    // TODO: 권한처리 
    const workspace = await this.workspaceRepository.findOne({
      where: { workspaceId },
    });
    if (!workspace) return null;

    const workspaceDto = new WorkspaceDto(workspace);

    // User 매핑
    const user = await this.userService.getUserByUserId(workspace.ownerId);
    if (user) {
      workspaceDto.owner = new PublicUserDto(user);
    }

    return workspaceDto;
  }

  async getWorkspacesByTeamId(teamId: string): Promise<WorkspaceDto[]> {
    // TODO: 권한처리
    const workspaces = await this.workspaceRepository.find({
      where: { teamId }
    });

    // User 매핑
    // TOOD: 성능개선
    const workspaceDtos = await Promise.all(
      workspaces.map(async (workspace) => {
        const user = await this.userService.getUserByUserId(workspace.ownerId);
        const workspaceDto = new WorkspaceDto(workspace);
        if (user) {
          workspaceDto.owner = new PublicUserDto(user);
        }
        return workspaceDto;
      })
    );

    return workspaceDtos;
  }

  async createWorkspaceFeature(param: CreateWorkspaceFeatureDto, workspaceId: string): Promise<WorkspaceFeatureDto | null> {
    const { order, featureType, isDefault } = param;

    const workspaceFeature = await this.workspaceFeatureRepository.save<Partial<WorkspaceFeatureEntity>>({
      workspaceId,
      featureId: nanoid(12),
      order,
      featureType
    });

    if (isDefault) {
      await this.workspaceRepository.update(
        { workspaceId },
        { defaultFeatureId: workspaceFeature.featureId }
      )
    }

    return new WorkspaceFeatureDto(workspaceFeature);
  }
}