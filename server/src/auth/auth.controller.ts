import { Body, Controller, Post, UseGuards } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { ApiOkResponseWithResult } from "@/common/decorator/api-ok-response-with-result";
import { ApiBearerAuth, ApiBody } from "@nestjs/swagger";
import { RegisterUserDto } from "./dto/register-user.dto";
import { ApiResult } from "@/dto/api-result.dto";
import { plainToInstance } from "class-transformer";
import { LoginUserDto } from "./dto/login-user.dto";
import { LoginUserResultDto } from "./dto/login-user-result.dto";
import { PublicUserDto } from "@/dto/public-user.dto";
import { RefreshTokenResultDto } from "./dto/refresh-token-result.dto";
import { RefreshTokenDto } from "./dto/refresh-token.dto";

@Controller('api/v1/auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
  ) {}

  @Post('register')
  @ApiOkResponseWithResult()
  @ApiBody({ type: RegisterUserDto })
  async registerUser(@Body() param: RegisterUserDto): Promise<ApiResult<PublicUserDto>> {
    const user = await this.authService.registerUser(param);

    const result = new ApiResult<PublicUserDto>({ data: user });
    return plainToInstance(ApiResult<PublicUserDto>, result);
  }

  @Post('login')
  @ApiOkResponseWithResult(LoginUserResultDto)
  @ApiBody({ type: LoginUserDto })
  async loginUser(@Body() param: LoginUserDto): Promise<ApiResult<LoginUserResultDto>> {
    const loginResult = await this.authService.loginUser(param);

    const result = new ApiResult<LoginUserResultDto>({ data: loginResult });
    return plainToInstance(ApiResult<LoginUserResultDto>, result);
  }

  @Post('refresh')
  @ApiOkResponseWithResult(RefreshTokenResultDto)
  @ApiBody({ type: RefreshTokenDto })
  @ApiBearerAuth('access-token')
  async refreshToken(
    @Body() param: RefreshTokenDto): Promise<ApiResult<RefreshTokenResultDto>> {
    const refreshResult = await this.authService.refreshToken(param.refreshToken);

    const result = new ApiResult<RefreshTokenResultDto>({ data: refreshResult });
    return plainToInstance(ApiResult<RefreshTokenResultDto>, result);
  }
}