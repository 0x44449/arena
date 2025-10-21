import ArenaWebCredential from "@/auth/web/arena-web-credential";
import { verifySupabaseJwt } from "@/auth/web/supabase.jwt";
import { UserEntity } from "@/entities/user.entity";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity) private readonly userRepository: Repository<UserEntity>
  ) {}

  async verifyToken(token: string): Promise<ArenaWebCredential> {
    const payload = await verifySupabaseJwt(token);

    const user = await this.userRepository.findOne({ where: { email: payload.email } });

    return {
      user: user || null,
      payload: payload || null,
    };
  }
}