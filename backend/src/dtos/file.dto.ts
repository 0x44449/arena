import { FileEntity } from "@/entities/file.entity";
import { OmitType } from "@nestjs/swagger";
import { UserDto } from "./user.dto";

export class FileDto extends OmitType(
  FileEntity,
  [
    'originalName',
    'storedName',
    'path',
    'category',
    'uploader',
    'uploaderId',
  ] as const
) {
  name: string;
  url: string;
  uploader: UserDto;

  public static fromEntity(entity: FileEntity): FileDto {
    return {
      fileId: entity.fileId,
      name: entity.originalName,
      mimeType: entity.mimeType,
      size: entity.size,
      createdAt: entity.createdAt,
      url: `${process.env.SERVER_BASE_URL}/api/v1/files/download/${entity.fileId}`,
      uploader: UserDto.fromEntity(entity.uploader),
    }
  }
}