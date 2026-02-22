package app.sandori.arena.api.domain.user.dtos;

import app.sandori.arena.api.domain.file.dtos.FileResponse;
import app.sandori.arena.api.domain.user.UserEntity;
import java.time.LocalDateTime;

public record UserResponse(
        String userId,
        String utag,
        String nick,
        FileResponse avatar,
        String email,
        String statusMessage,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {
    public static UserResponse from(UserEntity entity) {
        return new UserResponse(
                entity.getUserId(),
                entity.getUtag(),
                entity.getNick(),
                entity.getAvatar() != null ? FileResponse.from(entity.getAvatar()) : null,
                entity.getEmail(),
                entity.getStatusMessage(),
                entity.getCreatedAt(),
                entity.getUpdatedAt()
        );
    }
}
