import { FileEntity } from "@/entities/file.entity";
import { UserEntity } from "@/entities/user.entity";
import { WellKnownError } from "@/exceptions/well-known-error";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { nanoid } from "nanoid";
import { Repository } from "typeorm";

@Injectable()
export class FileService {
  constructor(
    @InjectRepository(FileEntity) private readonly fileRepository: Repository<FileEntity>,
  ) {}

  async findFileById(fileId: string): Promise<FileEntity | null> {
    return await this.fileRepository.findOne({
      where: { fileId },
      relations: ["uploader"],
    });
  }

  async deleteFile(fileId: string, requester: UserEntity): Promise<void> {
    const file = await this.findFileById(fileId);
    if (!file) {
      throw new WellKnownError({
        message: "File not found",
        errorCode: "FILE_NOT_FOUND",
      });
    }
    
    if (file.uploader.userId !== requester.userId) {
      throw new WellKnownError({
        message: "Unauthorized to delete this file",
        errorCode: "FILE_DELETE_UNAUTHORIZED",
      });
    }
    
    await this.fileRepository.delete(fileId);
  }

  async uploadFile(multerFile: Express.Multer.File, uploader: UserEntity): Promise<FileEntity> {
    if (!multerFile) {
      throw new WellKnownError({
        message: "Uploaded file not found",
        errorCode: "UPLOADED_FILE_NOT_FOUND",
      });
    }

    const file = this.fileRepository.create({
      fileId: nanoid(12),
      originalName: multerFile.originalname,
      storedName: multerFile.filename,
      mimeType: multerFile.mimetype,
      size: multerFile.size,
      path: multerFile.destination,
      uploader: uploader,
      category: 'file',
    });

    await this.fileRepository.save(file);
    const updated = await this.fileRepository.findOne({
      where: { fileId: file.fileId },
      relations: ["uploader"],
    });

    if (!updated) {
      throw new WellKnownError({
        message: "Failed to upload file",
        errorCode: "FILE_UPLOAD_FAILED",
      });
    }
    return updated;
  }

  async uploadFiles(multerFiles: Express.Multer.File[], uploader: UserEntity): Promise<FileEntity[]> {
    if (!multerFiles || multerFiles.length === 0) {
      throw new WellKnownError({
        message: "Uploaded files not found",
        errorCode: "UPLOADED_FILES_NOT_FOUND",
      });
    }

    const files = multerFiles.map(multerFile => {
      const file = this.fileRepository.create({
        fileId: nanoid(12),
        originalName: multerFile.originalname,
        storedName: multerFile.filename,
        mimeType: multerFile.mimetype,
        size: multerFile.size,
        path: multerFile.destination,
        uploader: uploader,
        category: 'file',
      });
      return file;
    });

    await this.fileRepository.save(files);
    const uploadeds = await this.fileRepository.find({
      where: files.map(f => ({ fileId: f.fileId })),
      relations: ["uploader"],
    });

    return uploadeds;
  }
}