package app.sandori.arena.api.domain.user.dtos;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

@Schema(description = "회원가입 요청")
public record CreateUserDto(
    @NotBlank(message = "NAME_REQUIRED")
    @Size(min = 1, max = 32, message = "INVALID_NAME_LENGTH")
    @Schema(description = "표시 이름", example = "홍길동")
    String name
) {}
