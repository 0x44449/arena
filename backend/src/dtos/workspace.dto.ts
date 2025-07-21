import { WorkspaceEntity } from "@/entities/workspace.entity";
import { UserDto } from "./user.dto";
import { OmitType } from "@nestjs/swagger";
import { TeamDto } from "./team.dto";

export class WorkspaceDto extends OmitType(
  WorkspaceEntity,
  [
    'team',
    'owner',
    'ownerId',
  ] as const
) {
  owner: UserDto;

  public static fromEntity(entity: WorkspaceEntity): WorkspaceDto {
    return {
      workspaceId: entity.workspaceId,
      name: entity.name,
      description: entity.description,
      teamId: entity.teamId,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
      owner: UserDto.fromEntity(entity.owner),
    }
  }
}