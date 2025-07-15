import { WorkspaceEntity } from "@/entities/workspace.entity";
import { plainToInstance } from "class-transformer";
import { UserDto } from "./user.dto";
import { OmitType } from "@nestjs/swagger";

export class WorkspaceDto extends OmitType(
  WorkspaceEntity,
  [
    'team',
    'teamId',
    'owner',
    'ownerId',
  ] as const
) {
  owner: UserDto;

  public static fromEntity(entity: WorkspaceEntity): WorkspaceDto {
    const dto = plainToInstance(WorkspaceDto, entity, {
      excludeExtraneousValues: true,
    });

    dto.owner = UserDto.fromEntity(entity.owner);

    return dto;
  }
}