package app.sandori.arena.api.domain.org.dtos;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;

@Schema(description = "초대 코드로 Org 가입 요청")
public record JoinOrgDto(
    @Schema(description = "초대 코드", example = "ABCD1234")
    @NotBlank
    String code
) {
}
