import { UnauthorizedError } from "@/commons/exceptions/unauthorized-error";
import { WellKnownError } from "@/commons/exceptions/well-known-error";
import firebaseAdmin from "@/commons/firebase.plugin";
import { ArenaAuthTokenPayloadDto } from "@/dtos/arena-auth-token-payload";
import { ArenaAuthTokenDto } from "@/dtos/arena-auth-token.dto";
import { AuthTokenEntity } from "@/entities/auth-token.entity";
import { UserEntity } from "@/entities/user.entity";
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt/dist/jwt.service";
import { InjectRepository } from "@nestjs/typeorm";
import { createHash, randomUUID } from "crypto";
import dayjs from "dayjs";
import { DecodedIdToken } from "firebase-admin/lib/auth/token-verifier";
import ms, { StringValue } from "ms";
import { Repository } from "typeorm";

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity) private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(AuthTokenEntity) private readonly authTokenRepository: Repository<AuthTokenEntity>,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  // async createSessionCookie(token: string): Promise<string> {
  //   let decoded: DecodedIdToken | null = null;
  //   try {
  //     decoded = await firebaseAdmin.auth().verifyIdToken(token);
  //   } catch {
  //     throw new WellKnownError({
  //       message: 'Invalid ID token',
  //       errorCode: 'INVALID_ID_TOKEN',
  //     });
  //   }

  //   const user = await this.userRepository.findOne({ where: { uid: decoded.uid } });
  //   if (!user) {
  //     throw new WellKnownError({
  //       message: 'User not found',
  //       errorCode: 'USER_NOT_FOUND',
  //     });
  //   }

  //   const sessionCookie = await firebaseAdmin.auth().createSessionCookie(token, { expiresIn: 5 * 60 * 60 * 24 * 1000 }); // 5 days
  //   return sessionCookie;
  // }

  async issueArenaTokensByFirebase(fbtoken: string): Promise<ArenaAuthTokenDto> {
    // token 및 사용자 검증
    let decoded: DecodedIdToken | null = null;
    try {
      decoded = await firebaseAdmin.auth().verifyIdToken(fbtoken);
    } catch {
      throw new UnauthorizedError('Invalid ID token');
    }

    if (!decoded) {
      throw new UnauthorizedError('Token verification failed');
    }

    const user = await this.userRepository.findOne({ where: { uid: decoded.uid } });
    if (!user) {
      throw new WellKnownError({
        message: 'User not found',
        errorCode: 'USER_NOT_FOUND',
      });
    }

    // access token 발급
    const payload = new ArenaAuthTokenPayloadDto({ userId: user.userId });
    const accessToken = this.jwtService.sign(payload);

    // refresh token 발급
    const refreshToken = randomUUID();

    // 발급한 내용 기록, 각 토큰은 해시값으로 저장
    const refreshTtl = this.configService.get<StringValue>('JWT_REFRESH_EXPIRES_IN') || '7d';
    const absoluteTtl = this.configService.get<StringValue>('JWT_ABSOLUTE_EXPIRES_IN') || '60d';
    const authToken = this.authTokenRepository.create({
      userId: user.userId,
      accessToken: createHash('sha256').update(accessToken).digest('hex'),
      refreshToken: createHash('sha256').update(refreshToken).digest('hex'),
      issuedAt: new Date(),
      expiredAt: new Date(Date.now() + ms(refreshTtl)),
      absoluteExpiresAt: new Date(Date.now() + ms(absoluteTtl)),
    });
    await this.authTokenRepository.save(authToken);

    return new ArenaAuthTokenDto({
      accessToken: accessToken,
      refreshToken: refreshToken,
    });
  }

  async refreshArenaTokens(refreshToken: string): Promise<ArenaAuthTokenDto> {
    const authToken = await this.authTokenRepository.findOne({
      where: {
        refreshToken: createHash('sha256').update(refreshToken).digest('hex'),
      }
    });

    if (!authToken) {
      throw new WellKnownError({
        message: 'Invalid or expired refresh token',
        errorCode: 'INVALID_REFRESH_TOKEN',
      });
    }

    if (dayjs(authToken.expiredAt).isBefore(dayjs())) {
      throw new WellKnownError({
        message: 'Refresh token has expired',
        errorCode: 'REFRESH_TOKEN_EXPIRED',
      });
    }

    if (dayjs(authToken.absoluteExpiresAt).isBefore(dayjs())) {
      throw new WellKnownError({
        message: 'Refresh token has reached its absolute expiration',
        errorCode: 'REFRESH_TOKEN_ABSOLUTE_EXPIRED',
      });
    }

    if (authToken.revokedAt !== null) {
      throw new WellKnownError({
        message: 'Refresh token has been revoked',
        errorCode: 'REFRESH_TOKEN_REVOKED',
      });
    }

    // access token 재발급
    const payload = new ArenaAuthTokenPayloadDto({ userId: authToken.userId });
    const accessToken = this.jwtService.sign(payload);

    // 새로운 refresh token 발급
    const newRefreshToken = randomUUID();

    // 재발급한 내용 기록, 각 토큰은 해시값으로 저장
    const ttl = this.configService.get<StringValue>('JWT_REFRESH_EXPIRES_IN') || '7d';
    const newAuthTokenEntity = this.authTokenRepository.create({
      userId: authToken.userId,
      accessToken: createHash('sha256').update(accessToken).digest('hex'),
      refreshToken: createHash('sha256').update(newRefreshToken).digest('hex'),
      issuedAt: new Date(),
      expiredAt: new Date(Date.now() + ms(ttl)),
      absoluteExpiresAt: authToken.absoluteExpiresAt,
    });
    const newAuthToken = await this.authTokenRepository.save(newAuthTokenEntity);

    // 기존 토큰은 만료 처리
    authToken.revokedAt = new Date();
    authToken.replacedBy = newAuthToken.tokenId;
    await this.authTokenRepository.save(authToken);

    return new ArenaAuthTokenDto({
      accessToken: accessToken,
      refreshToken: newRefreshToken,
    });
  }

  async verifyArenaToken(token: string): Promise<ArenaAuthTokenPayloadDto | null> {
    try {
      const decoded = await this.jwtService.verifyAsync<ArenaAuthTokenPayloadDto>(token);
      return decoded;
    } catch {
      return null;
    }
  }

  async verifyArenaTokenStrict(token: string): Promise<ArenaAuthTokenPayloadDto | null> {
    const decoded = await this.verifyArenaToken(token);
    if (!decoded) {
      return null;
    }

    const user = await this.userRepository.findOne({ where: { userId: decoded.userId } });
    if (!user) {
      throw new WellKnownError({
        message: 'User not found',
        errorCode: 'USER_NOT_FOUND',
      });
    }

    return decoded;
  }
}