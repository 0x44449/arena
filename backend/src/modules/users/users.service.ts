import { UserEntity } from "@/entities/user.entity";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { RegisterUserDto } from "./dto/register-user.dto";
import fireabseAdmin from "@/commons/firebase.plugin";
import { idgen } from "@/commons/id-generator";
import { WellKnownError } from "@/commons/exceptions/well-known-error";
import { UpdateUserDto } from "./dto/update-user.dto";
import { UpdateUserProfileDto } from "./dto/update-user-profile.dto";
import { FileEntity } from "@/entities/file.entity";
import ArenaFile from "@/commons/file-uploader/arena-file-util";
import { join } from "path";
import * as fs from 'fs';
import sharp from "sharp";

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity) private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(FileEntity) private readonly fileRepository: Repository<FileEntity>,
  ) {}

  async findUserByUserId(userId: string): Promise<UserEntity | null> {
    return this.userRepository.findOne({ where: { userId } });
  }

  async registerUser(param: RegisterUserDto): Promise<UserEntity> {
    let uid = '';
    if (param.provider === 'firebase') {
      try {
        const decoded = await fireabseAdmin.auth().verifyIdToken(param.token);
        uid = decoded.uid;
      } catch {
        throw new WellKnownError({
          message: 'Invalid Firebase token',
          errorCode: 'INVALID_FIREBASE_TOKEN',
        });
      }
    } else {
      throw new WellKnownError({
        message: 'Unsupported authentication provider',
        errorCode: 'UNSUPPORTED_AUTH_PROVIDER',
      });
    }

    const user = this.userRepository.create({
      userId: idgen.shortId(),
      email: param.email,
      displayName: param.displayName,
      uid: uid,
      provider: param.provider,
      avatarType: 'default',
      avatarKey: '1',
      message: '',
    });
    return this.userRepository.save(user);
  }

  async updateUserByUserId(param: UpdateUserDto, userId: string): Promise<UserEntity> {
    const user = await this.findUserByUserId(userId);
    if (!user) {
      throw new WellKnownError({
        message: 'User not found',
        errorCode: 'USER_NOT_FOUND',
      });
    }

    if (param.displayName) {
      user.displayName = param.displayName;
    }
    return this.userRepository.save(user);
  }

  async updateProfileByUserId(param: UpdateUserProfileDto, userId: string): Promise<UserEntity> {
    const user = await this.findUserByUserId(userId);
    if (!user) {
      throw new WellKnownError({
        message: 'User not found',
        errorCode: 'USER_NOT_FOUND',
      });
    }

    if (param.displayName) {
      user.displayName = param.displayName;
    }
    if (param.message) {
      user.message = param.message;
    }
    if (param.avatarFileId) {
      const file = await this.fileRepository.findOne({ where: { fileId: param.avatarFileId } });
      if (!file) {
        throw new WellKnownError({
          message: 'Avatar file not found',
          errorCode: 'FILE_NOT_FOUND',
        });
      }

      if (file.mimeType !== 'image/png' && file.mimeType !== 'image/jpeg') {
        throw new WellKnownError({
          message: 'Avatar file must be a PNG or JPEG image',
          errorCode: 'INVALID_FILE_TYPE',
        });
      }

      const fileName = ArenaFile.genFileName();
      const destPath = ArenaFile.getDestPath();
      const fileFullPath = join(destPath, fileName);
      const storedFileFullPath = join(file.path, file.storedName);

      // 파일 PNG 변환 및 저장
      await fs.promises.mkdir(destPath, { recursive: true });
      const savedFile = await sharp(storedFileFullPath).png().toFile(fileFullPath);

      const fileEntity = this.fileRepository.create({
        fileId: idgen.shortId(),
        originalName: file.originalName,
        storedName: fileName,
        mimeType: 'image/png',
        size: savedFile.size,
        path: destPath,
        uploaderId: file.uploaderId,
        category: 'avatar',
      });

      const savedFileEntity = await this.fileRepository.save(fileEntity);

      user.avatarKey = savedFileEntity.fileId;
      user.avatarType = 'user';
    }
    return this.userRepository.save(user);
  }

  async updateAvatarFileByUserId(file: Express.Multer.File, userId: string): Promise<UserEntity> {
    if (!file) {
      throw new WellKnownError({
        message: 'No file uploaded',
        errorCode: 'NO_FILE_UPLOADED',
      });
    }

    const user = await this.findUserByUserId(userId);
    if (!user) {
      throw new WellKnownError({
        message: 'User not found',
        errorCode: 'USER_NOT_FOUND',
      });
    }

    const fileName = ArenaFile.genFileName();
    const destPath = ArenaFile.getDestPath();
    const fileFullPath = join(destPath, fileName);

    // 파일 PNG 변환 및 저장
    await fs.promises.mkdir(destPath, { recursive: true });
    const savedFile = await sharp(file.buffer).png().toFile(fileFullPath);

    const fileEntity = this.fileRepository.create({
      fileId: idgen.shortId(),
      originalName: file.originalname,
      storedName: fileName,
      mimeType: 'image/png',
      size: savedFile.size,
      path: destPath,
      uploaderId: user.userId,
      category: 'avatar',
    });

    const savedFileEntity = await this.fileRepository.save(fileEntity);

    user.avatarKey = savedFileEntity.fileId;
    user.avatarType = 'user';
    const updatedUser = await this.userRepository.save(user);

    return updatedUser;
  }

  async getAvatarFileByUserId(userId: string): Promise<FileEntity | null> {
    const user = await this.findUserByUserId(userId);
    if (!user) {
      return null;
    }

    const file = await this.fileRepository.findOne({
      where: { fileId: user.avatarKey },
    });

    return file;
  }
}