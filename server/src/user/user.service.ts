import { UserEntity } from "@/entity/user.entity";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>
  ) {}

  async getUserByUserId(userId: string): Promise<UserEntity | null> {
    return this.userRepository.findOne({ where: { userId } });
  }
} 