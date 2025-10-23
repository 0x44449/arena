import ArenaWebCredential from "@/auth/web/arena-web-credential";
import { verifySupabaseJwt } from "@/auth/web/supabase.jwt";
import ArenaWsCredential from "@/auth/ws/arena-ws-credential";
import { UserEntity } from "@/entities/user.entity";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { JWTPayload, jwtVerify, SignJWT } from "jose";
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

  async issueWebSocketSTS(user: UserEntity): Promise<string> {
    const sts = await new SignJWT({
      sub: user.userId,
    })
      .setIssuer('arena-dev')
      .setAudience('ws')
      .setIssuedAt()
      .setExpirationTime('15m')
      .sign(Buffer.from(process.env.WEBSOCKET_STS_PRIVATE_KEY || "arena-dev-sts-private-key", 'utf-8'));

    return sts;
  }

  async verifyWebSocketSTS(sts: string): Promise<ArenaWsCredential> {
    const jwt = await jwtVerify(sts, Buffer.from(process.env.WEBSOCKET_STS_PRIVATE_KEY || "arena-dev-sts-private-key", 'utf-8'), {
      issuer: 'arena-dev',
      audience: 'ws',
    });
    const result: ArenaWsCredential = {
      user: null,
      payload: jwt.payload,
    };
    
    const userId = jwt.payload.sub;
    if (!userId) return result;

    const user = await this.userRepository.findOne({ where: { userId } });
    if (!user) return result;

    result.user = user;
    return result;
  }
}