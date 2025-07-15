import { TeamEntity } from "@/entities/team.entity";
import { OmitType } from "@nestjs/swagger";
import { plainToInstance } from "class-transformer";
import { UserDto } from "./user.dto";

export class TeamDto extends OmitType(
  TeamEntity,
  [
    'owner',
    'ownerId',
  ] as const
) {
  owner: UserDto;

  public static fromEntity(entity: TeamEntity): TeamDto {
    const dto = plainToInstance(TeamDto, entity, {
      excludeExtraneousValues: true,
    });

    dto.owner = UserDto.fromEntity(entity.owner);

    return dto;
  }
}