import { WellKnownError } from "@/common/exception-manage/well-known-error";
import { FileDto } from "@/dto/file.dto";
import { FileEntity } from "@/entity/file.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { nanoid } from "nanoid";
import { join } from "path";
import { Repository } from "typeorm";

export class FileService {
  constructor(
    @InjectRepository(FileEntity)
    private readonly fileRepository: Repository<FileEntity>,
  ) {}

  static getServerRelativePath() {
    return 'stored/file';
  }

  async getFileByFileId(fileId: string): Promise<FileDto> {
    const file = await this.fileRepository.findOne({
      where: { fileId },
    });

    if (!file) {
      throw new WellKnownError({
        message: "File not found",
        errorCode: "DOWNLOAD_FILE_NOT_FOUND",
      });
    }

    const fileDto = new FileDto(file);
    fileDto.url = `/files/download/${fileDto.fileId}`;
    return fileDto;
  }

  async saveUploadedFile(file: Express.Multer.File, uploaderId: string): Promise<FileDto> {
    if (!file) {
      throw new WellKnownError({
        message: "Upload file not found",
        errorCode: "UPLOAD_FILE_NOT_FOUND",
      });
    }

    const fileEntity = this.fileRepository.create({
      fileId: nanoid(12),
      originalName: file.originalname,
      storedName: file.filename,
      mimeType: file.mimetype,
      size: file.size,
      path: FileService.getServerRelativePath(),
      uploaderId: uploaderId,
    });
    await this.fileRepository.save(fileEntity);

    const fileDto = new FileDto(fileEntity);
    fileDto.url = `/files/download/${fileDto.fileId}`;
    return fileDto;
  }
}