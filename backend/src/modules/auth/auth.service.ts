import { UnauthorizedError } from "@/commons/exceptions/unauthorized-error";
import { WellKnownError } from "@/commons/exceptions/well-known-error";
import firebaseAdmin from "@/commons/firebase.plugin";
import { ArenaAuthTokenPayloadDto } from "@/dtos/arena-auth-token-payload";
import { ArenaAuthTokenDto } from "@/dtos/arena-auth-token.dto";
import { AuthTokenEntity } from "@/entities/auth-token.entity";
import { UserEntity } from "@/entities/user.entity";
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JsonWebTokenError, JwtService, NotBeforeError, TokenExpiredError } from "@nestjs/jwt";
import { InjectRepository } from "@nestjs/typeorm";
import { createHash, randomUUID } from "crypto";
import dayjs from "dayjs";
import { DecodedIdToken } from "firebase-admin/lib/auth/token-verifier";
import ms, { StringValue } from "ms";
import { Repository } from "typeorm";
import { IssueArenaTokenDto } from "./dtos/issue-arena-token.dto";
import { RegisterUserWithProviderDto } from "./dtos/register-user-with-provider.dto";
import { idgen } from "@/commons/id-generator";

interface ArenaAuthTokenPayloadTypes {
  userId: string;
}

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

  async issueArenaTokens(param: IssueArenaTokenDto): Promise<ArenaAuthTokenDto> {
    const { provider, token } = param;

    if (provider === 'firebase') {
      // token 및 사용자 검증
      let decoded: DecodedIdToken | null = null;
      try {
        decoded = await firebaseAdmin.auth().verifyIdToken(token);
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
      const payload: ArenaAuthTokenPayloadTypes = { userId: user.userId };
      const accessToken = this.jwtService.sign(payload, {
        secret: this.configService.get<string>('JWT_SECRET'),
        expiresIn: this.configService.get<StringValue>('JWT_ACCESS_EXPIRES_IN') || '15m',
        algorithm: 'HS256',
      });

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
    } else {
      throw new WellKnownError({
        message: 'Unsupported provider',
        errorCode: 'UNSUPPORTED_PROVIDER',
      });
    }
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
    const payload: ArenaAuthTokenPayloadTypes = { userId: authToken.userId };
    const accessToken = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_SECRET'),
      expiresIn: this.configService.get<StringValue>('JWT_ACCESS_EXPIRES_IN') || '15m',
      algorithm: 'HS256',
    });

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

  async verifyArenaToken(token: string): Promise<ArenaAuthTokenPayloadDto> {
    try {
      const decoded = await this.jwtService.verifyAsync<ArenaAuthTokenPayloadTypes>(token, {
        secret: this.configService.get<string>('JWT_SECRET'),
        algorithms: ['HS256'],
      });
      return new ArenaAuthTokenPayloadDto({ userId: decoded.userId });
    } catch (error) {
      console.error('Token verification error:', error);

      if (error instanceof TokenExpiredError) {
        throw new WellKnownError({
          message: 'Access token has expired',
          errorCode: 'ACCESS_TOKEN_EXPIRED',
        });
      } else if (error instanceof JsonWebTokenError) {
        throw new WellKnownError({
          message: 'Invalid access token',
          errorCode: 'INVALID_ACCESS_TOKEN',
        });

      } else if (error instanceof NotBeforeError) {
        throw new WellKnownError({
          message: 'Access token is not active',
          errorCode: 'ACCESS_TOKEN_NOT_ACTIVE',
        });
      }
      throw error;
    }
  }

  async verifyArenaTokenStrict(token: string): Promise<ArenaAuthTokenPayloadDto> {
    const decoded = await this.verifyArenaToken(token);

    const user = await this.userRepository.findOne({ where: { userId: decoded.userId } });
    if (!user) {
      throw new WellKnownError({
        message: 'User not found',
        errorCode: 'USER_NOT_FOUND',
      });
    }

    return decoded;
  }

  async registerUser(param: RegisterUserWithProviderDto): Promise<UserEntity> {
    if (param.provider === 'firebase') {
      let decoded: DecodedIdToken | null = null;

      try {
        decoded = await firebaseAdmin.auth().verifyIdToken(param.token);
      } catch {
        throw new WellKnownError({
          message: 'Invalid Firebase token',
          errorCode: 'INVALID_FIREBASE_TOKEN',
        });
      }

      if (!decoded.email) {
        throw new WellKnownError({
          message: 'Firebase token does not contain email',
          errorCode: 'USER_NO_EMAIL',
        });
      }

      const user = this.userRepository.create({
        userId: idgen.shortId(),
        email: decoded.email,
        displayName: param.displayName,
        uid: decoded.uid,
        provider: param.provider,
        avatarType: 'default',
        avatarKey: '1',
        message: '',
      });

      return this.userRepository.save(user);
    } else {
      throw new WellKnownError({
        message: 'Unsupported authentication provider',
        errorCode: 'UNSUPPORTED_AUTH_PROVIDER',
      });
    }
  }
}