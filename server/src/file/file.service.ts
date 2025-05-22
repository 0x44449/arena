import { WellKnownError } from "@/common/exception-manage/well-known-error";
import { FileDto } from "@/dto/file.dto";
import { FileEntity } from "@/entity/file.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { join } from "path";
import { Repository } from "typeorm";

export class FileService {
  constructor(
    @InjectRepository(FileEntity)
    private readonly fileRepository: Repository<FileEntity>,
  ) {}

  async getFileByFileId(fileId: string): Promise<FileDto> {
    const file = await this.fileRepository.findOne({
      where: { fileId },
    });

    if (!file) {
      throw new WellKnownError({
        message: "File not found",
        errorCode: "FILE_NOT_FOUND",
      });
    }

    const fileDto = new FileDto(file);
    fileDto.url = `/files/download/${fileDto.fileId}`;
    return fileDto;
  }
}