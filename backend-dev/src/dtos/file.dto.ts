import { FileEntity } from "@/entities/file.entity";
import { OmitType } from "@nestjs/swagger";
import { UserDto } from "./user.dto";

export class FileDto extends OmitType(
  FileEntity, [
    "uploader",
    "uploaderId",
    "originalName",
    "storedName",
    "path",
  ] as const
) {
  uploader: UserDto;
  name: string;
  url: string;

  public static fromEntity(entity: FileEntity): FileDto {
    return {
      fileId: entity.fileId,
      mimeType: entity.mimeType,
      size: entity.size,
      createdAt: entity.createdAt,
      uploader: UserDto.fromEntity(entity.uploader),
      name: entity.originalName,
      url: `${process.env.SERVER_BASE_URL}/api/v1/files/download/${entity.fileId}`,
    }
  }
}