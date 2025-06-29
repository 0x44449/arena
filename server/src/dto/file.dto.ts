import { FileEntity } from "@/entity/file.entity";
import { Exclude } from "class-transformer";

export class FileDto {
  fileId: string;
  name: string;

  @Exclude()
  originalName: string;
  @Exclude()
  storedName: string;

  mimeType: string;
  size: number;

  @Exclude()
  path: string;
  @Exclude()
  uploaderId: string;

  url: string;

  @Exclude()
  category: string;

  static fromEntity(entity: FileEntity): FileDto {
    const instance = new FileDto();
    Object.assign(instance, entity);
    instance.name = entity.originalName;
    instance.url = `${process.env.SERVER_BASE_URL}/api/v1/files/download/${instance.fileId}`;
    return instance;
  }
}