package app.sandori.arena.api.domain.org.dtos;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import java.util.Optional;

@Schema(description = "Org 생성 요청")
public record CreateOrgDto(
    @Schema(description = "조직명", example = "카페 아레나")
    @NotBlank
    @Size(max = 50)
    String name,

    @Schema(description = "조직 설명")
    Optional<@Size(max = 200) String> description
) {
}
