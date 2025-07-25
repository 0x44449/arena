import { Body, Controller, Post } from "@nestjs/common";
import { ApiResultDto } from "@/dtos/api-result.dto";
import { ApiOkResultWith } from "@/decorators/api-ok-result-with.decorator";
import { singleOf } from "@/dtos/dto-schema-factories";
import { AuthService } from "./auth.service";
import { ApiBody } from "@nestjs/swagger";
import { IssueArenaTokenDto } from "./dtos/issue-arena-token.dto";
import { ArenaAuthTokenDto } from "@/dtos/arena-auth-token.dto";
import { RefreshArenaTokenDto } from "./dtos/refresh-arena-token.dto";
import { ArenaAuthTokenPayloadDto } from "@/dtos/arena-auth-token-payload";
import { VerifyArenaTokenDto } from "./dtos/verify-arena-token.dto";
import { RegisterUserWithProviderDto } from "./dtos/register-user-with-provider.dto";
import { UserDto } from "@/dtos/user.dto";

@Controller('api/v1/auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
  ) {}

  @Post('token/issue')
  @ApiBody({ type: IssueArenaTokenDto })
  @ApiOkResultWith(singleOf(ArenaAuthTokenDto))
  async issueArenaTokens(@Body() body: IssueArenaTokenDto): Promise<ApiResultDto<ArenaAuthTokenDto>> {
    const tokens = await this.authService.issueArenaTokens(body);

    return new ApiResultDto<ArenaAuthTokenDto>({ data: tokens });
  }

  @Post('token/refresh')
  @ApiBody({ type: RefreshArenaTokenDto })
  @ApiOkResultWith(singleOf(ArenaAuthTokenDto))
  async refreshArenaTokens(@Body() body: RefreshArenaTokenDto): Promise<ApiResultDto<ArenaAuthTokenDto>> {
    const tokens = await this.authService.refreshArenaTokens(body.refreshToken);

    return new ApiResultDto<ArenaAuthTokenDto>({ data: tokens });
  }

  @Post('token/verify')
  @ApiBody({ type: VerifyArenaTokenDto })
  @ApiOkResultWith(singleOf(ArenaAuthTokenPayloadDto))
  async verifyArenaToken(@Body() body: VerifyArenaTokenDto): Promise<ApiResultDto<ArenaAuthTokenPayloadDto>> {
    const payload = await this.authService.verifyArenaTokenStrict(body.token);

    return new ApiResultDto<ArenaAuthTokenPayloadDto>({ data: payload });
  }

  @Post('register')
  @ApiBody({ type: RegisterUserWithProviderDto })
  @ApiOkResultWith(singleOf(UserDto))
  async registerUserWithProvider(@Body() body: RegisterUserWithProviderDto): Promise<ApiResultDto<UserDto>> {
    const user = await this.authService.registerUser(body);

    return new ApiResultDto<UserDto>({ data: UserDto.fromEntity(user) });
  }
}
