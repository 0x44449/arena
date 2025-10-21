import { UserEntity } from "@/entities/user.entity";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { UpdateUserDto } from "./dtos/update-user.dto";
import { nanoid } from "nanoid";
import { WellKnownError } from "@/exceptions/well-known-error";

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity) private readonly userRepository: Repository<UserEntity>,
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
}