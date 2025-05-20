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
import { randomUUID } from "crypto";
import { RefreshTokenEntity } from "@/entity/refresh-token.entity";
import dayjs from "dayjs";
import { nanoid } from "nanoid";

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
      throw new Error("All fields are required");
    }

    // email 체크
    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    if (!emailRegex.test(email)) {
      throw new Error("Invalid email format");
    }

    // loginId, email 중복체크
    const existingUser = await this.userRepository.findOne({
      where: [{ loginId }, { email }],
    });
    if (existingUser) {
      if (existingUser.loginId === loginId) {
        throw new Error("Login ID already exists");
      }
      if (existingUser.email === email) {
        throw new Error("Email already exists");
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
      throw new Error("Login ID and password are required");
    }

    // id is loginId or email
    const user = await this.userRepository.findOne({
      where: [{ loginId: id }, { email: id }],
    });

    if (!user) {
      throw new Error("User not found");
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new Error("Invalid password");
    }

    const accessToken = this.jwtService.sign({
      userId: user.userId,
    });
    const refreshToken = randomUUID();
    const refreshTokenHash = await bcrypt.hash(refreshToken, 10);
    const refreshTokenEntity = this.refreshTokenRepository.create({
      userId: user.userId,
      token: refreshTokenHash,
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
}