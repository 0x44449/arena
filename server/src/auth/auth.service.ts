import { Injectable } from "@nestjs/common";
import { RegisterUserDto } from "./dto/register-user.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { UserEntity } from "@/entity/user.entity";
import * as bcrypt from "bcrypt";
import { PublicUserDto } from "@/dto/public-user.dto";
import { LoginUserDto } from "./dto/login-user.dto";
import { JwtService } from "@nestjs/jwt";
import { LoginUserResultDto } from "./dto/login-user-result.dto";
import { createHash, randomUUID } from "crypto";
import { RefreshTokenEntity } from "@/entity/refresh-token.entity";
import dayjs from "dayjs";
import { nanoid } from "nanoid";
import { WellKnownError } from "@/common/exception-manage/well-known-error";
import { RefreshTokenResultDto } from "./dto/refresh-token-result.dto";
import AccessTokenPayload from "./access-token-payload";

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(RefreshTokenEntity)
    private readonly refreshTokenRepository: Repository<RefreshTokenEntity>,
    private readonly jwtService: JwtService,
  ) {}

  async registerUser(param: RegisterUserDto): Promise<PublicUserDto> {
    const { loginId, email, displayName, password } = param;
    if (!loginId || !email || !displayName || !password) {
      throw new WellKnownError({
        message: "Login ID, email, display name, and password are required",
        errorCode: "REGISTER_USER_REQUIRED_FIELDS",
      });
    }

    // email 체크
    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    if (!emailRegex.test(email)) {
      throw new WellKnownError({
        message: "Invalid email format",
        errorCode: "REGISTER_USER_INVALID_EMAIL_FORMAT",
      });
    }

    // loginId, email 중복체크
    const existingUser = await this.userRepository.findOne({
      where: [{ loginId }, { email }],
    });
    if (existingUser) {
      if (existingUser.loginId === loginId) {
        throw new WellKnownError({
          message: "Login ID already exists",
          errorCode: "REGISTER_USER_LOGIN_ID_DUPLICATE",
        });
      }
      if (existingUser.email === email) {
        throw new WellKnownError({
          message: "Email already exists",
          errorCode: "REGISTER_USER_EMAIL_DUPLICATE",
        });
      }
    }

    // 비밀번호 암호화
    const hashedPassword = await bcrypt.hash(password, 10);

    const userId = nanoid(12);
    const userEntity = this.userRepository.create({
      userId,
      loginId,
      email,
      displayName,
      password: hashedPassword,
      avatarType: 'default',
      avatarKey: '1',
    });
    const user = await this.userRepository.save(userEntity);
    const userDto = new PublicUserDto(user);
    return userDto;
  }

  async loginUser(param: LoginUserDto): Promise<LoginUserResultDto> {
    const { id, password } = param;
    if (!id || !password) {
      throw new WellKnownError({
        message: "Login ID or password is required",
        errorCode: "LOGIN_USER_ID_OR_PASSWORD_REQUIRED",
      });
    }

    // id is loginId or email
    const user = await this.userRepository.findOne({
      where: [{ loginId: id }, { email: id }],
    });

    if (!user) {
      throw new WellKnownError({
        message: "Id or password is incorrect",
        errorCode: "LOGIN_USER_ID_OR_PASSWORD_INCORRECT",
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new WellKnownError({
        message: "Id or password is incorrect",
        errorCode: "LOGIN_USER_ID_OR_PASSWORD_INCORRECT",
      });
    }

    const payload: AccessTokenPayload = {
      userId: user.userId,
    };
    const accessToken = this.jwtService.sign(payload);
    const accessTokenHash = createHash('sha256').update(accessToken).digest('hex'); // DB에서 WHERE 조건으로 사용 가능해야함

    const refreshToken = randomUUID();
    const refreshTokenHash = createHash('sha256').update(refreshToken).digest('hex'); // DB에서 WHERE 조건으로 사용 가능해야함
    const refreshTokenEntity = this.refreshTokenRepository.create({
      userId: user.userId,
      accessToken: accessTokenHash,
      refreshToken: refreshTokenHash,
      isRevoked: false,
      expiredAt: dayjs().add(7, 'day').toDate(),
    });
    await this.refreshTokenRepository.save(refreshTokenEntity);

    // User is valid, you can return user info or token here
    const userDto = new PublicUserDto(user);

    const loginUserResultDto = new LoginUserResultDto();
    loginUserResultDto.user = userDto;
    loginUserResultDto.accessToken = accessToken;
    loginUserResultDto.refreshToken = refreshToken;

    return loginUserResultDto;
  }

  async logoutUser(accessToken: string, userId: string): Promise<void> {
    const accessTokenHash = createHash('sha256').update(accessToken).digest('hex'); // DB에서 WHERE 조건으로 사용 가능해야함
    await this.refreshTokenRepository.update({
      userId,
      accessToken: accessTokenHash,
    }, {
      isRevoked: true,
    });
  }

  async refreshToken(userId: string, refreshToken: string): Promise<RefreshTokenResultDto> {
    const refreshTokenHash = createHash('sha256').update(refreshToken).digest('hex'); // DB에서 WHERE 조건으로 사용 가능해야함
    const refreshTokenEntity = await this.refreshTokenRepository.findOne({
      where: {
        userId,
        refreshToken: refreshTokenHash,
        isRevoked: false,
      },
    });

    if (!refreshTokenEntity) {
      throw new WellKnownError({
        message: "Refresh token not found",
        errorCode: "REFRESH_TOKEN_NOT_FOUND",
      });
    }

    if (dayjs(refreshTokenEntity.expiredAt).isBefore(dayjs())) {
      throw new WellKnownError({
        message: "Refresh token expired",
        errorCode: "REFRESH_TOKEN_EXPIRED",
      });
    }

    // Access token 재발급
    const payload: AccessTokenPayload = {
      userId: refreshTokenEntity.userId,
    };
    const accessToken = this.jwtService.sign(payload);
    const accessTokenHash = createHash('sha256').update(accessToken).digest('hex'); // DB에서 WHERE 조건으로 사용 가능해야함

    // Refresh token 재발급
    const newRefreshToken = randomUUID();
    const newRefreshTokenHash = createHash('sha256').update(newRefreshToken).digest('hex'); // DB에서 WHERE 조건으로 사용 가능해야함

    // Refresh token DB 업데이트
    refreshTokenEntity.accessToken = accessTokenHash;
    refreshTokenEntity.refreshToken = newRefreshTokenHash;
    refreshTokenEntity.expiredAt = dayjs().add(7, 'day').toDate();
    await this.refreshTokenRepository.save(refreshTokenEntity);

    const refreshTokenResultDto = new RefreshTokenResultDto();
    refreshTokenResultDto.accessToken = accessToken;
    refreshTokenResultDto.refreshToken = newRefreshToken;

    return refreshTokenResultDto;
  }

  verifyToken(accessToken: string): AccessTokenPayload | null {
    try {
      const payload = this.jwtService.verify<AccessTokenPayload>(accessToken);
      return payload;
    } catch {
      return null;
    }
  }
}