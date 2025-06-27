import { WellKnownError } from "@/common/exception-manage/well-known-error";
import { FileDto } from "@/dto/file.dto";
import { FileEntity } from "@/entity/file.entity";
import { ConfigService } from "@nestjs/config";
import { InjectRepository } from "@nestjs/typeorm";
import { nanoid } from "nanoid";
import { Repository } from "typeorm";

export class FileService {
  constructor(
    @InjectRepository(FileEntity)
    private readonly fileRepository: Repository<FileEntity>,
    private readonly configService: ConfigService,
  ) {}

  static getServerRelativePath() {
    return 'stored/file';
  }

  async getFileByFileId(fileId: string): Promise<FileDto> {
    const fileEntity = await this.fileRepository.findOne({
      where: { fileId },
    });

    if (!fileEntity) {
      throw new WellKnownError({
        message: "File not found",
        errorCode: "DOWNLOAD_FILE_NOT_FOUND",
      });
    }

    const fileDto = FileDto.fromEntity(fileEntity);
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
      path: file.destination,
      uploaderId: uploaderId,
      category: 'file',
    });
    await this.fileRepository.save(fileEntity);

    const fileDto = FileDto.fromEntity(fileEntity);
    return fileDto;
  }
}