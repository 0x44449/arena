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
import { join } from "path";
import { randomUUID } from "crypto";
import * as fs from 'fs';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(FileEntity)
    private readonly fileRepository: Repository<FileEntity>,
    private readonly configService: ConfigService,
  ) {}

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

  /**
   * 업로드된 사용자의 아바타를 서버에 저장하고 DB에 기록하며 사용자 프로필 정보를 업데이트 합니다.
   */
  async updateUserAvatar(file: Express.Multer.File, userId: string): Promise<PublicUserDto> {
    if (!file) {
      throw new WellKnownError({
        message: "Upload file not found",
        errorCode: "UPLOAD_FILE_NOT_FOUND",
      });
    }
    const user = await this.getUserByUserId(userId);
    if (!user) {
      throw new WellKnownError({
        message: "User not found",
        errorCode: "USER_NOT_FOUND",
      });
    }

    const fileName = randomUUID();
    const destinationDir = this.configService.get<string>('FILE_STORAGE_LOCATION')!;
    const fileFullPath = join(destinationDir, fileName);
    
    // 파일 PNG 변환 및 저장
    await fs.promises.mkdir(destinationDir, { recursive: true });
    const savedFile = await sharp(file.buffer).png().toFile(fileFullPath);

    // 파일 정보를 저장
    // 아바타 썸네일도 파일로 관리하고 카테고리만 분리
    const fileId = nanoid(12);
    const fileEntity = this.fileRepository.create({
      fileId: fileId,
      originalName: file.originalname,
      storedName: fileName,
      mimeType: 'image/png',
      size: savedFile.size,
      path: destinationDir,
      uploaderId: userId,
      category: 'avatar',
    });
    await this.fileRepository.save(fileEntity);

    // 사용자 정보를 업데이트
    user.avatarKey = fileId;
    user.avatarType = 'user';
    const updatedUser = await this.userRepository.save(user);

    const userDto = new PublicUserDto(updatedUser);
    return userDto;
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

    const fileDto = FileDto.fromEntity(fileEntity);
    return fileDto;
  }
}