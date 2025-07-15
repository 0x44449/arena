import { FileEntity } from "@/entities/file.entity";
import { OmitType } from "@nestjs/swagger";
import { plainToInstance } from "class-transformer";
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
    const dto = plainToInstance(FileDto, entity, {
      excludeExtraneousValues: true,
    });

    dto.name = entity.originalName;
    dto.url = `${process.env.SERVER_BASE_URL}/api/v1/files/download/${entity.fileId}`;
    dto.uploader = UserDto.fromEntity(entity.uploader);

    return dto;
  }
}