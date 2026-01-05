import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull } from 'typeorm';
import { FileEntity } from 'src/entities/file.entity';
import { S3Service } from './s3.service';
import { generateId } from 'src/utils/id-generator';
import { WellKnownException } from 'src/exceptions/well-known-exception';
import { PresignedUrlDto } from './dtos/presigned-url.dto';
import { RegisterFileDto } from './dtos/register-file.dto';

@Injectable()
export class FileService {
  private static readonly PRESIGNED_URL_EXPIRES_IN = 3600; // 1시간

  constructor(
    @InjectRepository(FileEntity)
    private readonly fileRepository: Repository<FileEntity>,
    private readonly s3Service: S3Service,
  ) {}

  async generatePresignedUrl(
    userId: string,
    bucket: 'public' | 'private',
    directory: string | undefined,
    mimeType: string,
  ): Promise<PresignedUrlDto> {
    const fileId = generateId();
    const key = directory
      ? `${userId}/${directory}/${fileId}`
      : `${userId}/${fileId}`;

    const uploadUrl =
      bucket === 'public'
        ? await this.s3Service.getPresignedUploadUrlPublic(
            key,
            mimeType,
            FileService.PRESIGNED_URL_EXPIRES_IN,
          )
        : await this.s3Service.getPresignedUploadUrlPrivate(
            key,
            mimeType,
            FileService.PRESIGNED_URL_EXPIRES_IN,
          );

    return {
      uploadUrl,
      key,
      expiresIn: FileService.PRESIGNED_URL_EXPIRES_IN,
    };
  }

  async registerFile(
    userId: string,
    bucket: 'public' | 'private',
    dto: RegisterFileDto,
  ): Promise<FileEntity> {
    // 권한 검증: 키가 userId로 시작하는지 확인
    if (!dto.key.startsWith(`${userId}/`)) {
      throw new WellKnownException({
        message: 'Invalid key for this user',
        errorCode: 'INVALID_KEY',
      });
    }

    // S3 메타데이터 검증
    const metadata = await this.s3Service.getMetadata(bucket, dto.key);
    if (!metadata) {
      throw new WellKnownException({
        message: 'File not found in S3',
        errorCode: 'FILE_NOT_FOUND',
      });
    }

    // FileEntity 저장
    const fileEntity = this.fileRepository.create({
      fileId: generateId(),
      ownerId: userId,
      storageKey: dto.key,
      bucket,
      mimeType: metadata.contentType,
      size: metadata.contentLength.toString(),
      originalName: dto.name,
    });

    return await this.fileRepository.save(fileEntity);
  }

  async getFileById(fileId: string): Promise<FileEntity> {
    const file = await this.fileRepository.findOne({
      where: { fileId, deletedAt: IsNull() },
    });

    if (!file) {
      throw new NotFoundException('File not found');
    }

    return file;
  }

  async deleteFile(fileId: string, userId: string): Promise<void> {
    const file = await this.getFileById(fileId);

    if (file.ownerId !== userId) {
      throw new WellKnownException({
        message: 'Not authorized to delete this file',
        errorCode: 'UNAUTHORIZED',
      });
    }

    await this.s3Service.delete(
      file.bucket as 'public' | 'private',
      file.storageKey,
    );

    await this.fileRepository.softDelete({ fileId });
  }
}
