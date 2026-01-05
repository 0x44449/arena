import { FileEntity } from "src/entities/file.entity";
import { FileDto } from "src/dtos/file.dto";
import { S3Service } from "src/modules/file/s3.service";

export function toFileDto(entity: FileEntity): FileDto {
  return {
    fileId: entity.fileId,
    url: S3Service.getFileUrl(entity.bucket, entity.storageKey),
    name: entity.originalName,
    mimeType: entity.mimeType,
    size: Number(entity.size),
    createdAt: entity.createdAt,
    updatedAt: entity.updatedAt,
  };
}
