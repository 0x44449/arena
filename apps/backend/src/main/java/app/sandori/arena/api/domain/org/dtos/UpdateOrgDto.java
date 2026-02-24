package app.sandori.arena.api.domain.org.dtos;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Size;
import java.util.Optional;

@Schema(description = "Org 수정 요청")
public record UpdateOrgDto(
    @Schema(description = "조직명")
    Optional<@Size(max = 50) String> name,

    @Schema(description = "조직 설명")
    Optional<@Size(max = 200) String> description,

    @Schema(description = "아바타 파일 ID")
    Optional<String> avatarFileId
) {
}
