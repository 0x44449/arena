package app.sandori.arena.api.domain.channel.dtos;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotEmpty;
import java.util.List;

@Schema(description = "대화방 멤버 초대 요청")
public record InviteMembersDto(
    @Schema(description = "초대할 사용자 ID 목록")
    @NotEmpty
    List<String> userIds
) {
}
