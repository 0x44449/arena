import { ParticipantEntity } from "src/entities/participant.entity";
import { ParticipantDto } from "src/dtos/participant.dto";
import { toUserDto } from "./user.mapper";

export function toParticipantDto(entity: ParticipantEntity): ParticipantDto {
  return {
    user: toUserDto(entity.user),
    lastReadAt: entity.lastReadAt,
    createdAt: entity.createdAt,
    updatedAt: entity.updatedAt,
  };
}
