import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Socket } from "socket.io";
import * as jwt from "jsonwebtoken";
import jwksClient from "jwks-rsa";

@Injectable()
export class WsJwtAuthGuard implements CanActivate {
  private readonly jwksClient: jwksClient.JwksClient;

  constructor(private readonly configService: ConfigService) {
    const jwksUri = this.configService.getOrThrow<string>("SUPABASE_JWKS_URI");
    this.jwksClient = jwksClient({
      jwksUri,
      cache: true,
      rateLimit: true,
      jwksRequestsPerMinute: 5,
    });
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const client: Socket = context.switchToWs().getClient();
    const token = client.handshake.auth?.token;

    if (!token) {
      client.disconnect();
      return false;
    }

    try {
      const decoded = jwt.decode(token, { complete: true });
      if (!decoded || !decoded.header.kid) {
        client.disconnect();
        return false;
      }

      const key = await this.jwksClient.getSigningKey(decoded.header.kid);
      const signingKey = key.getPublicKey();

      const payload = jwt.verify(token, signingKey, {
        algorithms: ["ES256"],
      }) as jwt.JwtPayload;

      client.data.user = {
        uid: payload.sub,
        email: payload.email,
      };

      return true;
    } catch (error) {
      client.disconnect();
      return false;
    }
  }
}
