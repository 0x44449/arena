import ArenaWebCredential from "@/auth/web/arena-web-credential";
import { verifySupabaseJwt } from "@/auth/web/supabase.jwt";
import ArenaWsCredential from "@/auth/ws/arena-ws-credential";
import { UserEntity } from "@/entities/user.entity";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { jwtVerify, SignJWT } from "jose";
import { AccessToken as LivekitAccessToken } from "livekit-server-sdk";
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

  async issueLiveSTS(channelId: string, user: UserEntity): Promise<string> {
    const livekitToken = new LivekitAccessToken(
      process.env.LIVEKIT_API_KEY || "arena-dev-live-api-key",
      process.env.LIVEKIT_API_SECRET || "arena-dev-live-secret", {
        identity: user.userId,
        ttl: "10m",
      }
    );

    livekitToken.addGrant({
      roomJoin: true,
      room: channelId,
      canPublish: true,
      canSubscribe: true,
    });

    return livekitToken.toJwt();
  }
}