import { Body, Controller, Post } from "@nestjs/common";
import { CreateSessionCookieDto } from "./dtos/create-session-cookie.dto";
import { ApiResultDto } from "@/dtos/api-result.dto";
import { SessionCookieDto } from "@/dtos/session-cookie.dto";
import { ApiOkResultWith } from "@/decorators/api-ok-result-with.decorator";
import { singleOf } from "@/dtos/dto-schema-factories";
import { AuthService } from "./auth.service";
import { ApiBody } from "@nestjs/swagger";

@Controller('api/v1/auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
  ) {}

  @Post('session-cookie')
  @ApiOkResultWith(singleOf(SessionCookieDto))
  @ApiBody({ type: CreateSessionCookieDto })
  async createSessionCookie(@Body() param: CreateSessionCookieDto): Promise<ApiResultDto<SessionCookieDto>> {
    const cookie = await this.authService.createSessionCookie(param.token);

    const result = new ApiResultDto<SessionCookieDto>({
      data: new SessionCookieDto({ cookie }),
    });
    return result;
  }
}
