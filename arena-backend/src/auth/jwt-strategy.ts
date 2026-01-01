import { Inject, Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { passportJwtSecret } from "jwks-rsa";
import { JwtPayload } from "src/types/jwt-payload.interface";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, "jwt") {
  private readonly logger = new Logger(JwtStrategy.name);

  constructor(
    @Inject(ConfigService) private readonly configService: ConfigService,
  ) {
    const jwksUri = configService.getOrThrow<string>("SUPABASE_JWKS_URI");

    console.log("JWKS URI:", jwksUri);

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKeyProvider: passportJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri,
        handleSigningKeyError: (err, cb) => {
          console.error("Signing key error:", err);
          cb(err);
        },
      }),
      algorithms: ["ES256"],
    });
  }

  async validate(payload: any): Promise<JwtPayload> {
    console.log("JWT payload:", payload);
    return {
      uid: payload.sub,
      email: payload.email,
    };
  }
}
