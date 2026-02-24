package app.sandori.arena.api.domain.profile.dtos;

import app.sandori.arena.api.domain.profile.ProfileEntity;
import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "프로필 응답")
public record ProfileDto(
    @Schema(description = "프로필 ID")
    String profileId,

    @Schema(description = "표시 이름")
    String name,

    @Schema(description = "아바타 파일 ID")
    String avatarFileId,

    @Schema(description = "Org 역할 (기본 프로필이면 null)")
    String role
) {
    public static ProfileDto from(ProfileEntity entity) {
        return new ProfileDto(
            entity.getProfileId(),
            entity.getName(),
            entity.getAvatarFileId(),
            entity.getRole()
        );
    }
}
