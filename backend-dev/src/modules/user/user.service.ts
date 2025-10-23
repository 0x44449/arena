import { UserEntity } from "@/entities/user.entity";
import { Inject, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { UpdateUserDto } from "./dtos/update-user.dto";
import { nanoid } from "nanoid";
import { WellKnownError } from "@/exceptions/well-known-error";
import { FileEntity } from "@/entities/file.entity";
import * as fs from 'fs';
import { getUploadServerPath } from "@/libs/file/arena-web-file-interceptor";
import { join } from "path";
import sharp from "sharp";
import { randomUUID } from "crypto";

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity) private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(FileEntity) private readonly fileRepository: Repository<FileEntity>,
  ) {}

  async findUserByEmail(email: string): Promise<UserEntity | null> {
    return await this.userRepository.findOne({ where: { email } });
  }

  async findUserByUserId(userId: string): Promise<UserEntity | null> {
    return await this.userRepository.findOne({ where: { userId } });
  }

  async createUser(param: { email: string, displayName: string, uid: string }): Promise<UserEntity> {
    const existingUser = await this.findUserByEmail(param.email);
    if (existingUser) {
      throw new WellKnownError({
        message: "User already exists",
        errorCode: "USER_ALREADY_EXISTS",
      });
    }

    const user = this.userRepository.create({
      userId: nanoid(12),
      email: param.email,
      uid: param.uid,
      displayName: param.displayName,
      message: "",
      avatarId: "default",
    });

    return await this.userRepository.save(user);
  }

  async updateUser(userId: string, param: UpdateUserDto): Promise<UserEntity> {
    await this.userRepository.update(userId, param);
    const updated = await this.userRepository.findOne({ where: { userId } });
    if (!updated) {
      throw new WellKnownError({
        message: "Failed to update user",
        errorCode: "USER_NOT_FOUND",
      });
    }

    return updated;
  }

  async uploadUserAvatar(multerFile: Express.Multer.File, user: UserEntity): Promise<UserEntity> {
    const uploadServerPath = join(getUploadServerPath(), "avatars");
    await fs.promises.mkdir(uploadServerPath, { recursive: true });

    const fileName = randomUUID();
    const pngFile = await sharp(multerFile.buffer).png().toFile(join(uploadServerPath, fileName));

    const fileEntity = this.fileRepository.create({
      fileId: nanoid(12),
      originalName: multerFile.originalname,
      storedName: fileName,
      mimeType: "image/png",
      size: pngFile.size,
      path: uploadServerPath,
      uploader: user,
      category: "avatar",
    });

    const saved = await this.fileRepository.save(fileEntity);
    
    user.avatarId = saved.fileId;
    return await this.userRepository.save(user);
  }

  async getUserAvatarByUserId(userId: string): Promise<FileEntity | null> {
    const user = await this.findUserByUserId(userId);
    if (!user || !user.avatarId) {
      return null;
    }

    return await this.fileRepository.findOne({ where: { fileId: user.avatarId } });
  }
}