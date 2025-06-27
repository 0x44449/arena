import { FileEntity } from "@/entity/file.entity";
import { ApiProperty } from "@nestjs/swagger";
import { Exclude, Expose } from "class-transformer";

export class FileDto {
  @ApiProperty()
  @Expose()
  fileId: string;

  @ApiProperty()
  @Expose()
  name: string;

  @Exclude()
  originalName: string;

  @Exclude()
  storedName: string;

  @ApiProperty()
  @Expose()
  mimeType: string;

  @ApiProperty()
  @Expose()
  size: number;

  @Exclude()
  path: string;

  @Exclude()
  uploaderId: string;

  @ApiProperty()
  @Expose()
  url: string;

  @Exclude()
  category: string;

  private constructor() {}

  static fromEntity(entity: FileEntity): FileDto {
    const instance = new FileDto();
    Object.assign(instance, entity);
    instance.name = entity.originalName;
    instance.url = `${process.env.SERVER_BASE_URL}/api/v1/files/download/${instance.fileId}`;
    return instance;
  }
}