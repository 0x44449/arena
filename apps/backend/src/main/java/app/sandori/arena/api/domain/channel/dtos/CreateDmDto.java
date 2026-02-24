package app.sandori.arena.api.domain.channel.dtos;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;

@Schema(description = "1:1 DM 생성 요청")
public record CreateDmDto(
    @Schema(description = "상대방 프로필 ID")
    @NotBlank
    String targetProfileId
) {
}
