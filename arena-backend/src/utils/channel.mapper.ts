import { ChannelEntity } from "src/entities/channel.entity";
import { GroupChannelEntity } from "src/entities/group-channel.entity";
import { ParticipantEntity } from "src/entities/participant.entity";
import { ChannelDto } from "src/dtos/channel.dto";
import { toFileDto } from "./file.mapper";
import { toParticipantDto } from "./participant.mapper";

export function toChannelDto(
  channel: ChannelEntity,
  groupChannel: GroupChannelEntity | null,
  participants: ParticipantEntity[],
): ChannelDto {
  return {
    channelId: channel.channelId,
    type: channel.type,
    name: channel.name,
    icon: groupChannel?.icon ? toFileDto(groupChannel.icon) : null,
    participants: participants.map(toParticipantDto),
    lastMessageAt: channel.lastMessageAt,
    createdAt: channel.createdAt,
    updatedAt: channel.updatedAt,
  };
}
