import type { FileEntity } from "src/entities/file.entity";
import { FileDto } from "src/dtos/file.dto";
import type { S3Service } from "src/modules/file/s3.service";

export async function toFileDto(
  entity: FileEntity,
  s3Service: S3Service
): Promise<FileDto> {
  const url = await s3Service.getPresignedDownloadUrl(
    entity.bucket as 'public' | 'private',
    entity.storageKey
  );

  return {
    id: entity.fileId,
    name: entity.originalName,
    url,
    mimeType: entity.mimeType,
    size: Number(entity.size),
    createdAt: entity.createdAt,
  };
}
