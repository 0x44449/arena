import { PublicUserDto } from "@/dto/public-user.dto";
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

  async getUserDtoByUserId(userId: string): Promise<PublicUserDto | null> {
    const user = await this.getUserByUserId(userId);
    if (!user) return null;

    return new PublicUserDto(user);
  }
}