import { UserEntity } from "@/entities/user.entity";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import ArenaWebCredential from "@/auth/arena-web-credential";
import { nanoid } from "nanoid";

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
      throw new Error('User already exists');
    }

    const userEntity = this.userRepository.create({
      userId: nanoid(12),
      email: param.email,
      uid: param.uid,
      displayName: param.displayName,
      message: "",
      avatarId: "default",
    });

    return await this.userRepository.save(userEntity);
  }

  async updateUser(userId: string, param: UpdateUserDto): Promise<UserEntity | null> {
    await this.userRepository.update(userId, param);
    return await this.userRepository.findOne({ where: { userId } });
  }
}