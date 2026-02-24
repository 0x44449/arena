package app.sandori.arena.api.domain.org.dtos;

import app.sandori.arena.api.domain.org.InviteCodeEntity;
import io.swagger.v3.oas.annotations.media.Schema;
import java.time.LocalDateTime;

@Schema(description = "초대 코드 응답")
public record InviteCodeDto(
    @Schema(description = "초대 코드 ID")
    String inviteCodeId,

    @Schema(description = "초대 코드")
    String code,

    @Schema(description = "생성일시")
    LocalDateTime createdAt
) {
    public static InviteCodeDto from(InviteCodeEntity entity) {
        return new InviteCodeDto(
            entity.getInviteCodeId(),
            entity.getCode(),
            entity.getCreatedAt()
        );
    }
}
