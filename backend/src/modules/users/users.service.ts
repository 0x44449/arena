import { UserEntity } from "@/entities/user.entity";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { RegisterUserDto } from "./dto/register-user.dto";
import fireabseAdmin from "@/libs/firebase.plugin";
import { idgen } from "@/libs/id-generator";

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity) private readonly userRepository: Repository<UserEntity>,
  ) {}

  async findUserByUid(uid: string): Promise<UserEntity | null> {
    return this.userRepository.findOne({ where: { uid } });
  }

  async registerUser(dto: RegisterUserDto): Promise<UserEntity> {
    let uid = '';
    if (dto.provider === 'google') {
      try {
        const decoded = await fireabseAdmin.auth().verifyIdToken(dto.token);
        uid = decoded.uid;
      } catch {

      }
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
}