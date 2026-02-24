package app.sandori.arena.api.domain.team.dtos;

import app.sandori.arena.api.domain.profile.ProfileEntity;
import app.sandori.arena.api.domain.team.TeamMemberEntity;
import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "Team 멤버 응답")
public record TeamMemberDto(
    @Schema(description = "Team 멤버 ID")
    String teamMemberId,

    @Schema(description = "프로필 ID")
    String profileId,

    @Schema(description = "프로필 이름")
    String name,

    @Schema(description = "아바타 파일 ID")
    String avatarFileId
) {
    public static TeamMemberDto from(TeamMemberEntity member, ProfileEntity profile) {
        return new TeamMemberDto(
            member.getTeamMemberId(),
            member.getProfileId(),
            profile != null ? profile.getName() : null,
            profile != null ? profile.getAvatarFileId() : null
        );
    }
}
