package app.sandori.arena.api.domain.channel.dtos;

import app.sandori.arena.api.domain.profile.ProfileEntity;
import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "대화방 멤버 응답")
public record ChannelMemberDto(
    @Schema(description = "프로필 ID")
    String profileId,

    @Schema(description = "프로필 이름")
    String name,

    @Schema(description = "아바타 파일 ID")
    String avatarFileId
) {
    public static ChannelMemberDto from(ProfileEntity profile) {
        return new ChannelMemberDto(
            profile.getProfileId(),
            profile.getName(),
            profile.getAvatarFileId()
        );
    }
}
