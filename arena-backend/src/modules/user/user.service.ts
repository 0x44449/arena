import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, IsNull, QueryFailedError } from "typeorm";
import { UserEntity } from "src/entities/user.entity";
import { CreateUserDto } from "./dtos/create-user.dto";
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

    try {
      return await this.userRepository.save(user);
    } catch (error) {
      if (error instanceof QueryFailedError && this.isUniqueViolation(error)) {
        const detail = this.getErrorDetail(error);
        if (detail.includes("(uid)")) {
          throw new WellKnownException({
            message: "User already exists",
            errorCode: "ALREADY_EXISTS_USER",
          });
        }
        if (detail.includes("(utag)")) {
          throw new WellKnownException({
            message: "Failed to generate unique utag",
            errorCode: "UTAG_GENERATION_FAILED",
          });
        }
      }
      throw error;
    }
  }

  private normalizeUtag(utag: string): string {
    return utag.trim().toUpperCase();
  }

  private async generateUniqueUtag(): Promise<string> {
    for (let attempt = 0; attempt < UserService.MAX_UTAG_ATTEMPTS; attempt += 1) {
      const candidate = this.generateRandomUtag();
      const exists = await this.userRepository.exist({ where: { utag: candidate } });
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

  private isUniqueViolation(error: QueryFailedError): boolean {
    return (error as QueryFailedError & { driverError?: { code?: string } }).driverError?.code === "23505";
  }

  private getErrorDetail(error: QueryFailedError): string {
    return (error as QueryFailedError & { driverError?: { detail?: string } }).driverError?.detail ?? "";
  }
}
