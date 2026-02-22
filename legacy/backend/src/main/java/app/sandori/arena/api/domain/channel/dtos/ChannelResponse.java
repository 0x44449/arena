package app.sandori.arena.api.domain.channel.dtos;

import app.sandori.arena.api.domain.channel.ChannelEntity;
import app.sandori.arena.api.domain.channel.GroupChannelEntity;
import app.sandori.arena.api.domain.channel.ParticipantEntity;
import app.sandori.arena.api.domain.file.dtos.FileResponse;
import java.time.LocalDateTime;
import java.util.List;

public record ChannelResponse(
        String channelId,
        String type,
        String name,
        FileResponse icon,
        List<ParticipantResponse> participants,
        LocalDateTime lastMessageAt,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {
    public static ChannelResponse from(ChannelEntity channel,
                                       GroupChannelEntity groupChannel,
                                       List<ParticipantEntity> participants) {
        FileResponse icon = null;
        if (groupChannel != null && groupChannel.getIcon() != null) {
            icon = FileResponse.from(groupChannel.getIcon());
        }

        return new ChannelResponse(
                channel.getChannelId(),
                channel.getType(),
                channel.getName(),
                icon,
                participants.stream().map(ParticipantResponse::from).toList(),
                channel.getLastMessageAt(),
                channel.getCreatedAt(),
                channel.getUpdatedAt()
        );
    }
}
