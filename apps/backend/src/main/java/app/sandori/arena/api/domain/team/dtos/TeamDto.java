package app.sandori.arena.api.domain.team.dtos;

import app.sandori.arena.api.domain.team.TeamEntity;
import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "Team 응답")
public record TeamDto(
    @Schema(description = "Team ID")
    String teamId,

    @Schema(description = "Org ID")
    String orgId,

    @Schema(description = "팀명")
    String name,

    @Schema(description = "멤버 수")
    int memberCount
) {
    public static TeamDto from(TeamEntity team, int memberCount) {
        return new TeamDto(
            team.getTeamId(),
            team.getOrgId(),
            team.getName(),
            memberCount
        );
    }
}
