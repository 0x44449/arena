import { ParticipantEntity } from "src/entities/participant.entity";
import { ParticipantDto } from "src/dtos/participant.dto";
import { UserDto } from "src/dtos/user.dto";

export function toParticipantDto(
  entity: ParticipantEntity,
  userDto: UserDto,
): ParticipantDto {
  return {
    user: userDto,
    lastReadAt: entity.lastReadAt,
    joinedAt: entity.joinedAt,
  };
}
