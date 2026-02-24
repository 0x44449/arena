package app.sandori.arena.api.domain.team.dtos;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;

@Schema(description = "Team 멤버 추가 요청")
public record AddTeamMemberDto(
    @Schema(description = "추가할 사용자 ID")
    @NotBlank
    String userId
) {
}
