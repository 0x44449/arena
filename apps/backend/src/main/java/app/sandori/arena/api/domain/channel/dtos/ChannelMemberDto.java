package app.sandori.arena.api.domain.channel.dtos;

import app.sandori.arena.api.domain.channel.ChannelMemberEntity;
import app.sandori.arena.api.domain.profile.ProfileEntity;
import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "대화방 멤버 응답")
public record ChannelMemberDto(
    @Schema(description = "멤버 ID")
    String channelMemberId,

    @Schema(description = "사용자 ID")
    String userId,

    @Schema(description = "프로필 이름")
    String name,

    @Schema(description = "아바타 파일 ID")
    String avatarFileId
) {
    public static ChannelMemberDto from(ChannelMemberEntity member, ProfileEntity profile) {
        return new ChannelMemberDto(
            member.getChannelMemberId(),
            member.getUserId(),
            profile != null ? profile.getName() : null,
            profile != null ? profile.getAvatarFileId() : null
        );
    }
}
