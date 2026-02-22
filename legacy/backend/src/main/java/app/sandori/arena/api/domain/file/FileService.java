package app.sandori.arena.api.domain.file;

import app.sandori.arena.api.domain.file.dtos.PresignedUrlResponse;
import app.sandori.arena.api.domain.file.dtos.RegisterFileRequest;
import app.sandori.arena.api.global.exception.WellKnownException;
import app.sandori.arena.api.global.util.IdGenerator;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class FileService {

    private static final int PRESIGNED_URL_EXPIRES_IN = 3600;

    private final FileRepository fileRepository;
    private final S3Service s3Service;

    public PresignedUrlResponse generatePresignedUrl(String userId, String bucket,
                                                      String directory, String mimeType) {
        String fileId = IdGenerator.generate();
        String key = directory != null
                ? userId + "/" + directory + "/" + fileId
                : userId + "/" + fileId;

        String uploadUrl = "public".equals(bucket)
                ? s3Service.getPresignedUploadUrlPublic(key, mimeType, PRESIGNED_URL_EXPIRES_IN)
                : s3Service.getPresignedUploadUrlPrivate(key, mimeType, PRESIGNED_URL_EXPIRES_IN);

        return new PresignedUrlResponse(uploadUrl, key, PRESIGNED_URL_EXPIRES_IN);
    }

    @Transactional
    public FileEntity registerFile(String userId, String bucket, RegisterFileRequest dto) {
        if (!dto.getKey().startsWith(userId + "/")) {
            throw new WellKnownException("INVALID_KEY", "Invalid key for this user");
        }

        S3Service.S3Metadata metadata = s3Service.getMetadata(bucket, dto.getKey());
        if (metadata == null) {
            throw new WellKnownException("FILE_NOT_FOUND", "File not found in S3");
        }

        FileEntity fileEntity = FileEntity.builder()
                .fileId(IdGenerator.generate())
                .ownerId(userId)
                .storageKey(dto.getKey())
                .bucket(bucket)
                .mimeType(metadata.contentType())
                .size(metadata.contentLength())
                .originalName(dto.getName())
                .build();

        return fileRepository.save(fileEntity);
    }

    @Transactional(readOnly = true)
    public FileEntity getFileById(String fileId) {
        return fileRepository.findByFileIdAndDeletedAtIsNull(fileId)
                .orElseThrow(() -> new WellKnownException("FILE_NOT_FOUND", "File not found"));
    }

    @Transactional
    public void deleteFile(String fileId, String userId) {
        FileEntity file = getFileById(fileId);

        if (!file.getOwnerId().equals(userId)) {
            throw new WellKnownException("UNAUTHORIZED", "Not authorized to delete this file");
        }

        s3Service.delete(file.getBucket(), file.getStorageKey());
        file.softDelete();
        fileRepository.save(file);
    }
}
