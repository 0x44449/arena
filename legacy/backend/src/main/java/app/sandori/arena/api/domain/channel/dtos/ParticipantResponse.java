package app.sandori.arena.api.domain.channel.dtos;

import app.sandori.arena.api.domain.channel.ParticipantEntity;
import app.sandori.arena.api.domain.user.dtos.UserResponse;
import java.time.LocalDateTime;

public record ParticipantResponse(
        UserResponse user,
        LocalDateTime lastReadAt,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {
    public static ParticipantResponse from(ParticipantEntity entity) {
        return new ParticipantResponse(
                UserResponse.from(entity.getUser()),
                entity.getLastReadAt(),
                entity.getCreatedAt(),
                entity.getUpdatedAt()
        );
    }
}
