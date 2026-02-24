package app.sandori.arena.api.domain.channel.dtos;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Size;
import java.util.List;

@Schema(description = "그룹 채팅 생성 요청")
public record CreateGroupDto(
    @Schema(description = "그룹 이름", example = "주방 팀 채팅")
    @NotBlank
    @Size(max = 50)
    String name,

    @Schema(description = "초기 멤버 사용자 ID 목록 (본인 제외)")
    @NotEmpty
    List<String> memberUserIds
) {
}
