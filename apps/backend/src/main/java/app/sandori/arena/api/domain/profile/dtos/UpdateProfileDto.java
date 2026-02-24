package app.sandori.arena.api.domain.profile.dtos;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Size;
import java.util.Optional;

@Schema(description = "기본 프로필 수정 요청")
public record UpdateProfileDto(
    @Size(min = 1, max = 32, message = "INVALID_NAME_LENGTH")
    @Schema(description = "표시 이름")
    Optional<String> name,

    @Schema(description = "아바타 파일 ID")
    Optional<String> avatarFileId
) {}
