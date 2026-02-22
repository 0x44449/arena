package app.sandori.arena.api.domain.file;

import app.sandori.arena.api.global.entity.BaseTimeEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Index;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "files", indexes = {
        @Index(name = "idx_files_owner_id", columnList = "ownerId")
})
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class FileEntity extends BaseTimeEntity {

    @Id
    private String fileId;

    @Column(nullable = false)
    private String ownerId;

    @Column(nullable = false, length = 512)
    private String storageKey;

    @Column(nullable = false, length = 20)
    private String bucket;

    @Column(nullable = false, length = 127)
    private String mimeType;

    @Column(nullable = false)
    private Long size;

    @Column(nullable = false, length = 255)
    private String originalName;

    @Builder
    public FileEntity(String fileId, String ownerId, String storageKey,
                      String bucket, String mimeType, Long size, String originalName) {
        this.fileId = fileId;
        this.ownerId = ownerId;
        this.storageKey = storageKey;
        this.bucket = bucket;
        this.mimeType = mimeType;
        this.size = size;
        this.originalName = originalName;
    }
}
