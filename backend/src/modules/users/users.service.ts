import { UserEntity } from "@/entities/user.entity";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { RegisterUserDto } from "./dto/register-user.dto";
import fireabseAdmin from "@/commons/firebase.plugin";
import { idgen } from "@/commons/id-generator";
import { WellKnownError } from "@/commons/exceptions/well-known-error";
import { UpdateUserDto } from "./dto/update-user.dto";

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity) private readonly userRepository: Repository<UserEntity>,
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
}