import { PublicUserDto } from "@/dto/public-user.dto";
import { UserEntity } from "@/entity/user.entity";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { UpdateUserDto } from "./dto/update-user.dto";
import { FileDto } from "@/dto/file.dto";
import { WellKnownError } from "@/common/exception-manage/well-known-error";
import { FileEntity } from "@/entity/file.entity";
import { nanoid } from "nanoid";
import { ConfigService } from "@nestjs/config";
import sharp from "sharp";
import { extname, join } from "path";
import { randomUUID } from "crypto";

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(FileEntity)
    private readonly fileRepository: Repository<FileEntity>,
    private readonly configService: ConfigService,
  ) {}

  static getAvatarRelativePath() {
    return 'stored/avatar';
  }

  async getUserByUserId(userId: string): Promise<UserEntity | null> {
    return this.userRepository.findOne({ where: { userId } });
  }

  async getUserDtoByUserId(userId: string): Promise<PublicUserDto | null> {
    const user = await this.getUserByUserId(userId);
    if (!user) return null;

    return new PublicUserDto(user);
  }

  async updateUserDtoByUserId(userId: string, param: UpdateUserDto): Promise<PublicUserDto | null> {
    const user = await this.getUserByUserId(userId);
    if (!user) return null;

    // 필드 확인
    if (param.displayName === undefined) {
      return new PublicUserDto(user);
    }
    // 변경사항 확인
    if (user.displayName === param.displayName) {
      return new PublicUserDto(user);
    }

    if (param.displayName) {
      user.displayName = param.displayName;
    }
    const updatedUser = await this.userRepository.save(user);
    return new PublicUserDto(updatedUser);
  }

  async saveUploadedAvatar(file: Express.Multer.File, userId: string): Promise<FileDto> {
    if (!file) {
      throw new WellKnownError({
        message: "Upload file not found",
        errorCode: "UPLOAD_FILE_NOT_FOUND",
      });
    }

    const fileName = randomUUID();
    const fileDestinationDir = join(process.cwd(), UserService.getAvatarRelativePath());
    const fileFullPath = join(fileDestinationDir, fileName);
    const savedFile = await sharp(file.buffer).png().toFile(fileFullPath);

    const fileEntity = this.fileRepository.create({
      fileId: nanoid(12),
      originalName: file.originalname,
      storedName: fileName,
      mimeType: 'image/png',
      size: savedFile.size,
      path: fileDestinationDir,
      uploaderId: userId,
      category: 'avatar',
    });
    await this.fileRepository.save(fileEntity);

    const fileDto = new FileDto(fileEntity);
    fileDto.url = `${this.configService.get('SERVER_BASE_URL')}/api/v1/users/${userId}/avatar/thumbnail`;
    return fileDto;
  }

  async getAvatarFileByUserId(userId: string): Promise<FileDto | null> {
    const user = await this.getUserByUserId(userId);
    if (!user || !user.avatarKey) {
      return null;
    }

    const fileEntity = await this.fileRepository.findOne({
      where: {
        fileId: user.avatarKey
      }
    });
    if (!fileEntity) {
      return null;
    }

    const fileDto = new FileDto(fileEntity);
    fileDto.url = `${this.configService.get('SERVER_BASE_URL')}/api/v1/users/${userId}/avatar/thumbnail`;
    return fileDto;
  }
}