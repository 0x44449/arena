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

  constructor(input: Partial<FileDto> | FileEntity) {
    Object.assign(this, input);

    if (input instanceof FileEntity) {
      this.name = input.originalName;
    }
  }
}