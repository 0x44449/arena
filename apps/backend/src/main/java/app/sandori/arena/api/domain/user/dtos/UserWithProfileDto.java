package app.sandori.arena.api.domain.user.dtos;

import app.sandori.arena.api.domain.profile.ProfileEntity;
import app.sandori.arena.api.domain.profile.dtos.ProfileDto;
import app.sandori.arena.api.domain.user.UserEntity;
import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "사용자 + 기본 프로필 응답")
public record UserWithProfileDto(
    @Schema(description = "사용자 ID")
    String userId,

    @Schema(description = "Supabase UID")
    String uid,

    @Schema(description = "이메일")
    String email,

    @Schema(description = "기본 프로필")
    ProfileDto profile
) {
    public static UserWithProfileDto from(UserEntity user, ProfileEntity profile) {
        return new UserWithProfileDto(
            user.getUserId(),
            user.getUid(),
            user.getEmail(),
            ProfileDto.from(profile)
        );
    }
}
