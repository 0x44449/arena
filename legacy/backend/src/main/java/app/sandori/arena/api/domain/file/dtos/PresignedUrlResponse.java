package app.sandori.arena.api.domain.file.dtos;

public record PresignedUrlResponse(
        String uploadUrl,
        String key,
        int expiresIn
) {
}
