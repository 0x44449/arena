import { Inject, Injectable, OnModuleInit } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { 
  S3Client, 
  PutObjectCommand, 
  GetObjectCommand, 
  DeleteObjectCommand,
  HeadObjectCommand,
  HeadBucketCommand,
  CreateBucketCommand,
  PutBucketAclCommand
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import Redis from "ioredis";
import { REDIS_CLIENT } from "src/redis/redis.constants";

@Injectable()
export class S3Service implements OnModuleInit {
  private static readonly PRESIGNED_URL_EXPIRES_IN = 86400; // 24시간
  private static readonly CACHE_TTL = 82800; // 23시간
  private static readonly CACHE_REFRESH_THRESHOLD = 3600; // 1시간
  private static readonly S3_BASE_URL = process.env.S3_BASE_URL || "http://localhost:14566";

  static getFileUrl(bucket: string, storageKey: string): string {
    return `${S3Service.S3_BASE_URL}/${bucket}/${storageKey}`;
  }

  private readonly s3Client: S3Client;
  private readonly publicBucket: string;
  private readonly privateBucket: string;

  constructor(
    private readonly configService: ConfigService,
    @Inject(REDIS_CLIENT)
    private readonly redis: Redis,
  ) {
    this.s3Client = new S3Client({
      region: this.configService.get<string>("AWS_REGION") || "us-east-1",
      endpoint: this.configService.get<string>("AWS_ENDPOINT"),
      credentials: {
        accessKeyId: this.configService.get<string>("AWS_ACCESS_KEY_ID") || "test",
        secretAccessKey: this.configService.get<string>("AWS_SECRET_ACCESS_KEY") || "test",
      },
      forcePathStyle: true,
    });

    this.publicBucket = this.configService.get<string>("S3_PUBLIC_BUCKET") || "arena-files-public";
    this.privateBucket = this.configService.get<string>("S3_PRIVATE_BUCKET") || "arena-files-private";
  }

  async onModuleInit() {
    await this.ensureBucketExists(this.publicBucket, true);
    await this.ensureBucketExists(this.privateBucket, false);
  }

  private async ensureBucketExists(bucketName: string, isPublic: boolean): Promise<void> {
    try {
      await this.s3Client.send(new HeadBucketCommand({ Bucket: bucketName }));
      console.log(`✅ Bucket exists: ${bucketName}`);
    } catch (error: any) {
      if (error.name === 'NotFound' || error.$metadata?.httpStatusCode === 404) {
        try {
          await this.s3Client.send(new CreateBucketCommand({ Bucket: bucketName }));
          console.log(`✅ Created bucket: ${bucketName}`);
          
          if (isPublic) {
            await this.s3Client.send(new PutBucketAclCommand({
              Bucket: bucketName,
              ACL: 'public-read',
            }));
            console.log(`✅ Set bucket public: ${bucketName}`);
          }
        } catch (createError) {
          console.error(`❌ Failed to create bucket: ${bucketName}`, createError);
          throw createError;
        }
      } else {
        console.error(`❌ Failed to check bucket: ${bucketName}`, error);
        throw error;
      }
    }
  }

  async getPresignedUploadUrlPublic(
    key: string, 
    mimeType: string, 
    expiresIn: number = 3600
  ): Promise<string> {
    const command = new PutObjectCommand({
      Bucket: this.publicBucket,
      Key: key,
      ContentType: mimeType,
      ACL: 'public-read',
    });

    return await getSignedUrl(this.s3Client, command, { expiresIn });
  }

  async getPresignedUploadUrlPrivate(
    key: string, 
    mimeType: string, 
    expiresIn: number = 3600
  ): Promise<string> {
    const command = new PutObjectCommand({
      Bucket: this.privateBucket,
      Key: key,
      ContentType: mimeType,
    });

    return await getSignedUrl(this.s3Client, command, { expiresIn });
  }

  async getPresignedDownloadUrl(
    bucket: 'public' | 'private',
    key: string,
  ): Promise<string> {
    // Public은 캐싱 불필요 (static URL)
    if (bucket === 'public') {
      return S3Service.getFileUrl(this.publicBucket, key);
    }

    // Private는 캐싱
    const cacheKey = `presigned:${bucket}:${key}`;
    
    // 1. 캐시 확인
    const cached = await this.redis.get(cacheKey);
    if (cached) {
      const ttl = await this.redis.ttl(cacheKey);
      
      // TTL이 충분히 남았으면 재사용
      if (ttl > S3Service.CACHE_REFRESH_THRESHOLD) {
        return cached;
      }
    }

    // 2. 새로 생성
    const url = await this.generatePresignedDownloadUrl(bucket, key);

    // 3. 캐싱
    await this.redis.set(cacheKey, url, "EX", S3Service.CACHE_TTL);

    return url;
  }

  private async generatePresignedDownloadUrl(
    bucket: 'public' | 'private',
    key: string,
  ): Promise<string> {
    const bucketName = bucket === 'public' ? this.publicBucket : this.privateBucket;
    
    const command = new GetObjectCommand({
      Bucket: bucketName,
      Key: key,
    });

    return await getSignedUrl(
      this.s3Client, 
      command, 
      { expiresIn: S3Service.PRESIGNED_URL_EXPIRES_IN }
    );
  }

  async delete(bucket: 'public' | 'private', key: string): Promise<void> {
    const bucketName = bucket === 'public' ? this.publicBucket : this.privateBucket;
    
    const command = new DeleteObjectCommand({
      Bucket: bucketName,
      Key: key,
    });

    await this.s3Client.send(command);

    // 캐시 삭제
    const cacheKey = `presigned:${bucket}:${key}`;
    await this.redis.del(cacheKey);
  }

  async exists(bucket: 'public' | 'private', key: string): Promise<boolean> {
    const bucketName = bucket === 'public' ? this.publicBucket : this.privateBucket;
    
    try {
      const command = new HeadObjectCommand({
        Bucket: bucketName,
        Key: key,
      });
      await this.s3Client.send(command);
      return true;
    } catch (error: any) {
      if (error.name === 'NotFound' || error.$metadata?.httpStatusCode === 404) {
        return false;
      }
      throw error;
    }
  }

  async getMetadata(
    bucket: 'public' | 'private',
    key: string
  ): Promise<{ contentType: string; contentLength: number } | null> {
    const bucketName = bucket === 'public' ? this.publicBucket : this.privateBucket;
    
    try {
      const command = new HeadObjectCommand({
        Bucket: bucketName,
        Key: key,
      });
      const response = await this.s3Client.send(command);
      
      return {
        contentType: response.ContentType || 'application/octet-stream',
        contentLength: response.ContentLength || 0,
      };
    } catch (error: any) {
      if (error.name === 'NotFound' || error.$metadata?.httpStatusCode === 404) {
        return null;
      }
      throw error;
    }
  }
}
