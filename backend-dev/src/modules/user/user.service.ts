import { UserEntity } from "@/entities/user.entity";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";

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

  async createUser(param: CreateUserDto): Promise<UserEntity> {
    const userEntity = this.userRepository.create({
      userId: '',
      provider: 'email',
      providerUid: '',
      displayName: param.displayName,
      message: '',
    });

    return await this.userRepository.save(userEntity);
  }

  async updateUser(param: UpdateUserDto): Promise<UserEntity> {
    return await this.userRepository.save(param);
  }
}