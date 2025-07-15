import { WellKnownError } from "@/commons/exceptions/well-known-error";
import { FileEntity } from "@/entities/file.entity";
import { UserEntity } from "@/entities/user.entity";
import { idgen } from "@/commons/id-generator";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

@Injectable()
export class FilesService {
  constructor(
    @InjectRepository(FileEntity) private readonly fileRepository: Repository<FileEntity>,
  ) {}

  async findFileByFileId(fileId: string): Promise<FileEntity | null> {
    return await this.fileRepository.findOne({
      where: { fileId },
      relations: ['uploader'],
    });
  }

  async uploadFile(uploadedFile: Express.Multer.File, uploader: UserEntity): Promise<FileEntity> {
    if (!uploadedFile) {
      throw new WellKnownError({
        message: "Upload file not found",
        errorCode: "UPLOAD_FILE_NOT_FOUND",
      });
    }

    const file = this.fileRepository.create({
      fileId: idgen.shortId(),
      originalName: uploadedFile.originalname,
      storedName: uploadedFile.filename,
      mimeType: uploadedFile.mimetype,
      size: uploadedFile.size,
      path: uploadedFile.destination,
      uploader: uploader,
      category: 'file',
    });

    try {
      return await this.fileRepository.save(file);
    } catch (error) {
      throw new WellKnownError({
        message: "Failed to save file",
        errorCode: "FILE_SAVE_ERROR",
      });
    }
  }
}