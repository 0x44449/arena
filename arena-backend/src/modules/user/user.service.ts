import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull } from 'typeorm';
import { UserEntity } from 'src/entities/user.entity';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { WellKnownException } from 'src/exceptions/well-known-exception';
import { generateId } from 'src/utils/id-generator';
import { FileService } from '../file/file.service';
import { Signal } from 'src/signal/signal';
import { SignalChannel } from 'src/signal/signal.channels';

@Injectable()
export class UserService {
  private static readonly UTAG_LENGTH = 6;
  private static readonly UTAG_CHARSET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  private static readonly MAX_UTAG_ATTEMPTS = 10;

  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly fileService: FileService,
    private readonly signal: Signal,
  ) {}

  async findByUid(uid: string): Promise<UserEntity | null> {
    return this.userRepository.findOne({
      where: { uid, deletedAt: IsNull() },
      relations: ['avatar'],
    });
  }

  async getByUid(uid: string): Promise<UserEntity> {
    const user = await this.findByUid(uid);
    if (!user) {
      throw new WellKnownException({
        message: 'User not found',
        errorCode: 'USER_NOT_FOUND',
      });
    }
    return user;
  }

  async findByUserId(userId: string): Promise<UserEntity | null> {
    return this.userRepository.findOne({
      where: { userId, deletedAt: IsNull() },
      relations: ['avatar'],
    });
  }

  async getByUserId(userId: string): Promise<UserEntity> {
    const user = await this.findByUserId(userId);
    if (!user) {
      throw new WellKnownException({
        message: 'User not found',
        errorCode: 'USER_NOT_FOUND',
      });
    }
    return user;
  }

  async create(uid: string, dto: CreateUserDto): Promise<UserEntity> {
    const existing = await this.findByUid(uid);
    if (existing) {
      throw new WellKnownException({
        message: 'User already exists',
        errorCode: 'ALREADY_EXISTS_USER',
      });
    }

    const utag = await this.generateUniqueUtag();

    const user = this.userRepository.create({
      userId: generateId(),
      uid,
      utag,
      nick: dto.nick,
      email: dto.email ?? null,
      statusMessage: dto.statusMessage ?? null,
      avatarFileId: null,
    });

    await this.userRepository.save(user);

    // 세션 무효화 이벤트 발행
    await this.signal.publish(SignalChannel.USER_UPDATED, { uid });

    // avatar relation 포함해서 조회 (null이지만 일관성 유지)
    return (await this.findByUid(uid))!;
  }

  async update(userId: string, dto: UpdateUserDto): Promise<UserEntity> {
    const user = await this.getByUserId(userId);

    if (dto.nick !== undefined) {
      user.nick = dto.nick;
    }
    if (dto.statusMessage !== undefined) {
      user.statusMessage = dto.statusMessage;
    }
    if (dto.avatarFileId !== undefined) {
      if (dto.avatarFileId !== null) {
        // fileId 존재 여부 검증
        await this.fileService.getFileById(dto.avatarFileId);
      }
      user.avatarFileId = dto.avatarFileId;
    }

    await this.userRepository.save(user);

    // 세션 무효화 이벤트 발행
    await this.signal.publish(SignalChannel.USER_UPDATED, { uid: user.uid });

    // avatar relation 포함해서 다시 조회
    return (await this.findByUserId(userId))!;
  }

  private async generateUniqueUtag(): Promise<string> {
    for (
      let attempt = 0;
      attempt < UserService.MAX_UTAG_ATTEMPTS;
      attempt += 1
    ) {
      const candidate = this.generateRandomUtag();
      const exists = await this.userRepository.exists({
        where: { utag: candidate },
      });
      if (!exists) {
        return candidate;
      }
    }
    throw new WellKnownException({
      message: 'Failed to generate unique utag',
      errorCode: 'UTAG_GENERATION_FAILED',
    });
  }

  private generateRandomUtag(): string {
    let result = '';
    for (let i = 0; i < UserService.UTAG_LENGTH; i += 1) {
      const index = Math.floor(Math.random() * UserService.UTAG_CHARSET.length);
      result += UserService.UTAG_CHARSET.charAt(index);
    }
    return result;
  }
}
