import { ChannelEntity } from "@/entities/channel.entity";
import { UserDto } from "./user.dto";
import { OmitType } from "@nestjs/swagger";
import { TeamDto } from "./team.dto";

export class ChannelDto extends OmitType(
  ChannelEntity,
  [
    'team',
    'owner',
    'ownerId',
  ] as const
) {
  owner: UserDto;

  public static fromEntity(entity: ChannelEntity): ChannelDto {
    return {
      channelId: entity.channelId,
      name: entity.name,
      description: entity.description,
      teamId: entity.teamId,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
      owner: UserDto.fromEntity(entity.owner),
    }
  }
}