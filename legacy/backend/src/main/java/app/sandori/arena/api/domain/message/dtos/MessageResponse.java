package app.sandori.arena.api.domain.message.dtos;

import app.sandori.arena.api.domain.message.MessageEntity;
import app.sandori.arena.api.domain.user.dtos.UserResponse;
import java.time.LocalDateTime;

public record MessageResponse(
        String messageId,
        String channelId,
        UserResponse sender,
        long seq,
        String content,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {
    public static MessageResponse from(MessageEntity entity) {
        return new MessageResponse(
                entity.getMessageId(),
                entity.getChannelId(),
                UserResponse.from(entity.getSender()),
                entity.getSeq(),
                entity.getContent(),
                entity.getCreatedAt(),
                entity.getUpdatedAt()
        );
    }
}
