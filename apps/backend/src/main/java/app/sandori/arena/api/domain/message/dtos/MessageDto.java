package app.sandori.arena.api.domain.message.dtos;

import app.sandori.arena.api.domain.message.MessageEntity;
import io.swagger.v3.oas.annotations.media.Schema;
import java.time.LocalDateTime;

@Schema(description = "메시지 응답")
public record MessageDto(
    @Schema(description = "메시지 ID")
    String messageId,

    @Schema(description = "대화방 ID")
    String channelId,

    @Schema(description = "발신자 프로필 ID")
    String senderId,

    @Schema(description = "메시지 내용")
    String content,

    @Schema(description = "생성일시")
    LocalDateTime createdAt,

    @Schema(description = "수정일시")
    LocalDateTime updatedAt
) {
    public static MessageDto from(MessageEntity message) {
        return new MessageDto(
            message.getMessageId(),
            message.getChannelId(),
            message.getSenderId(),
            message.getContent(),
            message.getCreatedAt(),
            message.getUpdatedAt()
        );
    }
}
