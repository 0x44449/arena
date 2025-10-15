import { TeamEntity } from "@/entities/team.entity";
import { OmitType } from "@nestjs/swagger";
import { UserDto } from "./user.dto";

export class TeamDto extends OmitType(
  TeamEntity, [
    "owner",
    "ownerId",
  ] as const
) {
  owner: UserDto;

  public static fromEntity(entity: TeamEntity): TeamDto {
    return {
      teamId: entity.teamId,
      name: entity.name,
      description: entity.description,
      owner: UserDto.fromEntity(entity.owner),
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }
}