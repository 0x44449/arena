package app.sandori.arena.api.domain.team.dtos;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

@Schema(description = "Team 생성 요청")
public record CreateTeamDto(
    @Schema(description = "팀명", example = "홀 팀")
    @NotBlank
    @Size(max = 50)
    String name
) {
}
