import { ChannelEntity } from "@/entities/channel.entity";
import { OmitType } from "@nestjs/swagger";
import { TeamDto } from "./team.dto";
import { UserDto } from "./user.dto";

export class ChannelDto extends OmitType(
  ChannelEntity, [
    "team",
    "owner",
    "ownerId",
  ] as const
) {
  owner: UserDto;

  public static fromEntity(entity: ChannelEntity): ChannelDto {
    return {
      channelId: entity.channelId,
      name: entity.name,
      description: entity.description,
      teamId: entity.teamId,
      owner: UserDto.fromEntity(entity.owner),
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }
}