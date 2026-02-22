package app.sandori.arena.api.domain.file.dtos;

import app.sandori.arena.api.domain.file.FileEntity;
import app.sandori.arena.api.domain.file.S3Service;
import java.time.LocalDateTime;

public record FileResponse(
        String fileId,
        String url,
        String name,
        String mimeType,
        long size,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {
    public static FileResponse from(FileEntity entity) {
        return new FileResponse(
                entity.getFileId(),
                S3Service.getFileUrl(entity.getBucket(), entity.getStorageKey()),
                entity.getOriginalName(),
                entity.getMimeType(),
                entity.getSize(),
                entity.getCreatedAt(),
                entity.getUpdatedAt()
        );
    }
}
