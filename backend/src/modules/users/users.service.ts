import { UserEntity } from "@/entities/user.entity";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { RegisterUserDto } from "./dto/register-user.dto";
import fireabseAdmin from "@/commons/firebase.plugin";
import { idgen } from "@/commons/id-generator";
import { WellKnownError } from "@/commons/exceptions/well-known-error";

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity) private readonly userRepository: Repository<UserEntity>,
  ) {}

  async findUserByUserId(userId: string): Promise<UserEntity | null> {
    return this.userRepository.findOne({ where: { userId } });
  }

  async registerUser(dto: RegisterUserDto): Promise<UserEntity> {
    let uid = '';
    if (dto.provider === 'google') {
      try {
        const decoded = await fireabseAdmin.auth().verifyIdToken(dto.token);
        uid = decoded.uid;
      } catch {
        throw new WellKnownError({
          message: 'Invalid Google token',
          errorCode: 'INVALID_GOOGLE_TOKEN',
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
      email: dto.email,
      displayName: dto.displayName,
      uid: uid,
      provider: dto.provider,
      avatarType: 'default',
      avatarKey: '1',
    });
    return this.userRepository.save(user);
  }

  async updateUserByUserId(user: UserEntity, param: Partial<UserEntity>): Promise<UserEntity> {
    const existingUser = await this.findUserByUserId(user.userId);
    if (!existingUser) {
      throw new WellKnownError({
        message: 'User not found',
        errorCode: 'USER_NOT_FOUND',
      });
    }

    Object.assign(existingUser, param);
    return this.userRepository.save(existingUser);
  }
}