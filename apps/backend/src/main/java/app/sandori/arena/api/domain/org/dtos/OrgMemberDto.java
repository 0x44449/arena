package app.sandori.arena.api.domain.org.dtos;

import app.sandori.arena.api.domain.org.OrgMemberEntity;
import app.sandori.arena.api.domain.profile.ProfileEntity;
import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "Org 멤버 응답")
public record OrgMemberDto(
    @Schema(description = "멤버 ID")
    String orgMemberId,

    @Schema(description = "사용자 ID")
    String userId,

    @Schema(description = "역할 (OWNER/USER)")
    String role,

    @Schema(description = "프로필 이름")
    String name,

    @Schema(description = "아바타 파일 ID")
    String avatarFileId
) {
    public static OrgMemberDto from(OrgMemberEntity member, ProfileEntity profile) {
        return new OrgMemberDto(
            member.getOrgMemberId(),
            member.getUserId(),
            member.getRole(),
            profile != null ? profile.getName() : null,
            profile != null ? profile.getAvatarFileId() : null
        );
    }
}
