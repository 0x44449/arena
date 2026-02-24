package app.sandori.arena.api.domain.channel.dtos;

import app.sandori.arena.api.domain.channel.ChannelEntity;
import io.swagger.v3.oas.annotations.media.Schema;
import java.util.List;

@Schema(description = "대화방 응답")
public record ChannelDto(
    @Schema(description = "대화방 ID")
    String channelId,

    @Schema(description = "Org ID")
    String orgId,

    @Schema(description = "타입 (DM/GROUP)")
    String type,

    @Schema(description = "대화방 이름 (DM은 null)")
    String name,

    @Schema(description = "멤버 목록")
    List<ChannelMemberDto> members
) {
    public static ChannelDto from(ChannelEntity channel, List<ChannelMemberDto> members) {
        return new ChannelDto(
            channel.getChannelId(),
            channel.getOrgId(),
            channel.getType(),
            channel.getName(),
            members
        );
    }
}
