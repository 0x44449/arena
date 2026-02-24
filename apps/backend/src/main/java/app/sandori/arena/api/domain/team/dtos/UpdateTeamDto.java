package app.sandori.arena.api.domain.team.dtos;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Size;
import java.util.Optional;

@Schema(description = "Team 수정 요청")
public record UpdateTeamDto(
    @Schema(description = "팀명")
    Optional<@Size(max = 50) String> name
) {
}
