package app.sandori.arena.api.domain.file;

import jakarta.annotation.PostConstruct;
import java.time.Duration;
import java.util.concurrent.TimeUnit;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.BucketAlreadyExistsException;
import software.amazon.awssdk.services.s3.model.BucketAlreadyOwnedByYouException;
import software.amazon.awssdk.services.s3.model.CreateBucketRequest;
import software.amazon.awssdk.services.s3.model.DeleteObjectRequest;
import software.amazon.awssdk.services.s3.model.HeadBucketRequest;
import software.amazon.awssdk.services.s3.model.HeadObjectRequest;
import software.amazon.awssdk.services.s3.model.HeadObjectResponse;
import software.amazon.awssdk.services.s3.model.NoSuchBucketException;
import software.amazon.awssdk.services.s3.model.NoSuchKeyException;
import software.amazon.awssdk.services.s3.model.ObjectCannedACL;
import software.amazon.awssdk.services.s3.model.PutBucketAclRequest;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;
import software.amazon.awssdk.services.s3.presigner.S3Presigner;
import software.amazon.awssdk.services.s3.presigner.model.PresignedPutObjectRequest;
import software.amazon.awssdk.services.s3.presigner.model.PutObjectPresignRequest;

@Slf4j
@Service
public class S3Service {

    private static final int PRESIGNED_URL_EXPIRES_IN = 86400;
    private static final long CACHE_TTL = 82800;
    private static final long CACHE_REFRESH_THRESHOLD = 3600;

    private static String s3BaseUrl;

    private final S3Client s3Client;
    private final S3Presigner s3Presigner;
    private final StringRedisTemplate redisTemplate;
    private final String publicBucket;
    private final String privateBucket;

    public S3Service(S3Client s3Client,
                     S3Presigner s3Presigner,
                     StringRedisTemplate redisTemplate,
                     @Value("${aws.s3.public-bucket}") String publicBucket,
                     @Value("${aws.s3.private-bucket}") String privateBucket,
                     @Value("${aws.s3.base-url}") String baseUrl) {
        this.s3Client = s3Client;
        this.s3Presigner = s3Presigner;
        this.redisTemplate = redisTemplate;
        this.publicBucket = publicBucket;
        this.privateBucket = privateBucket;
        s3BaseUrl = baseUrl;
    }

    public static String getFileUrl(String bucket, String storageKey) {
        return s3BaseUrl + "/" + bucket + "/" + storageKey;
    }

    @PostConstruct
    void init() {
        ensureBucketExists(publicBucket, true);
        ensureBucketExists(privateBucket, false);
    }

    private void ensureBucketExists(String bucketName, boolean isPublic) {
        try {
            s3Client.headBucket(HeadBucketRequest.builder().bucket(bucketName).build());
            log.info("Bucket exists: {}", bucketName);
        } catch (NoSuchBucketException e) {
            try {
                s3Client.createBucket(CreateBucketRequest.builder().bucket(bucketName).build());
                log.info("Created bucket: {}", bucketName);

                if (isPublic) {
                    s3Client.putBucketAcl(PutBucketAclRequest.builder()
                            .bucket(bucketName)
                            .acl("public-read")
                            .build());
                    log.info("Set bucket public: {}", bucketName);
                }
            } catch (BucketAlreadyExistsException | BucketAlreadyOwnedByYouException ex) {
                log.info("Bucket already exists: {}", bucketName);
            } catch (Exception ex) {
                log.error("Failed to create bucket: {}", bucketName, ex);
            }
        } catch (Exception e) {
            log.error("Failed to check bucket: {}", bucketName, e);
        }
    }

    public String getPresignedUploadUrlPublic(String key, String mimeType, int expiresIn) {
        PutObjectRequest putRequest = PutObjectRequest.builder()
                .bucket(publicBucket)
                .key(key)
                .contentType(mimeType)
                .acl(ObjectCannedACL.PUBLIC_READ)
                .build();

        PutObjectPresignRequest presignRequest = PutObjectPresignRequest.builder()
                .signatureDuration(Duration.ofSeconds(expiresIn))
                .putObjectRequest(putRequest)
                .build();

        PresignedPutObjectRequest presigned = s3Presigner.presignPutObject(presignRequest);
        return presigned.url().toString();
    }

    public String getPresignedUploadUrlPrivate(String key, String mimeType, int expiresIn) {
        PutObjectRequest putRequest = PutObjectRequest.builder()
                .bucket(privateBucket)
                .key(key)
                .contentType(mimeType)
                .build();

        PutObjectPresignRequest presignRequest = PutObjectPresignRequest.builder()
                .signatureDuration(Duration.ofSeconds(expiresIn))
                .putObjectRequest(putRequest)
                .build();

        PresignedPutObjectRequest presigned = s3Presigner.presignPutObject(presignRequest);
        return presigned.url().toString();
    }

    public void delete(String bucket, String key) {
        String bucketName = "public".equals(bucket) ? publicBucket : privateBucket;
        s3Client.deleteObject(DeleteObjectRequest.builder()
                .bucket(bucketName)
                .key(key)
                .build());

        String cacheKey = "presigned:" + bucket + ":" + key;
        redisTemplate.delete(cacheKey);
    }

    public record S3Metadata(String contentType, long contentLength) {
    }

    public S3Metadata getMetadata(String bucket, String key) {
        String bucketName = "public".equals(bucket) ? publicBucket : privateBucket;
        try {
            HeadObjectResponse response = s3Client.headObject(HeadObjectRequest.builder()
                    .bucket(bucketName)
                    .key(key)
                    .build());
            return new S3Metadata(
                    response.contentType() != null ? response.contentType() : "application/octet-stream",
                    response.contentLength() != null ? response.contentLength() : 0
            );
        } catch (NoSuchKeyException e) {
            return null;
        }
    }

    private String resolveBucketName(String bucket) {
        return "public".equals(bucket) ? publicBucket : privateBucket;
    }
}
