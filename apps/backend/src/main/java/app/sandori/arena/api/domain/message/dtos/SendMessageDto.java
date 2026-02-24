package app.sandori.arena.api.domain.message.dtos;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

@Schema(description = "메시지 전송 요청")
public record SendMessageDto(
    @Schema(description = "메시지 내용", example = "안녕하세요!")
    @NotBlank
    @Size(max = 5000)
    String content
) {}
