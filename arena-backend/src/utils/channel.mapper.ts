import { ChannelEntity } from "src/entities/channel.entity";
import { ChannelDto } from "src/dtos/channel.dto";
import { FileDto } from "src/dtos/file.dto";
import { ParticipantDto } from "src/dtos/participant.dto";

export function toChannelDto(
  channel: ChannelEntity,
  icon: FileDto | null,
  participants: ParticipantDto[],
): ChannelDto {
  return {
    channelId: channel.channelId,
    type: channel.type,
    name: channel.name,
    icon,
    participants,
    lastMessageAt: channel.lastMessageAt,
    createdAt: channel.createdAt,
  };
}
