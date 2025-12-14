import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, IsNull } from "typeorm";
import { UserEntity } from "src/entities/user.entity";
import { CreateUserDto } from "./dtos/create-user.dto";
import { UpdateUserDto } from "./dtos/update-user.dto";
import { WellKnownException } from "src/exceptions/well-known-exception";

@Injectable()
export class UserService {
  private static readonly UTAG_LENGTH = 6;
  private static readonly UTAG_CHARSET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  private static readonly MAX_UTAG_ATTEMPTS = 10;

  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) { }

  async findByUid(uid: string): Promise<UserEntity | null> {
    return this.userRepository.findOne({
      where: { uid, deletedAt: IsNull() },
    });
  }

  async findByUtag(utag: string): Promise<UserEntity | null> {
    const normalized = this.normalizeUtag(utag);
    if (!normalized) {
      return null;
    }
    return this.userRepository.findOne({
      where: { utag: normalized, deletedAt: IsNull() },
    });
  }

  async create(dto: CreateUserDto): Promise<UserEntity> {
    const existing = await this.findByUid(dto.uid);
    if (existing) {
      throw new WellKnownException({
        message: "User already exists",
        errorCode: "ALREADY_EXISTS_USER",
      });
    }

    const utag = await this.generateUniqueUtag();

    const user = this.userRepository.create({
      uid: dto.uid,
      utag,
      nick: dto.nick,
      email: dto.email ?? null,
      statusMessage: dto.statusMessage ?? null,
    });

    return await this.userRepository.save(user);
  }

  async update(utag: string, dto: UpdateUserDto): Promise<UserEntity | null> {
    const user = await this.findByUtag(utag);
    if (!user) {
      return null;
    }

    if (dto.nick !== undefined) {
      user.nick = dto.nick;
    }
    if (dto.statusMessage !== undefined) {
      user.statusMessage = dto.statusMessage;
    }

    return await this.userRepository.save(user);
  }

  private normalizeUtag(utag: string): string {
    return utag.trim().toUpperCase();
  }

  private async generateUniqueUtag(): Promise<string> {
    for (let attempt = 0; attempt < UserService.MAX_UTAG_ATTEMPTS; attempt += 1) {
      const candidate = this.generateRandomUtag();
      const exists = await this.userRepository.exists({ where: { utag: candidate } });
      if (!exists) {
        return candidate;
      }
    }
    throw new WellKnownException({
      message: "Failed to generate unique utag",
      errorCode: "UTAG_GENERATION_FAILED",
    });
  }

  private generateRandomUtag(): string {
    let result = "";
    for (let i = 0; i < UserService.UTAG_LENGTH; i += 1) {
      const index = Math.floor(Math.random() * UserService.UTAG_CHARSET.length);
      result += UserService.UTAG_CHARSET.charAt(index);
    }
    return result;
  }
}
