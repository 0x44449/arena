import { ArenaWebAuthGuard } from "@/auth/web/arena-web-auth-guard";
import { ApiResultDto, withApiResult } from "@/dtos/api-result.dto";
import { Controller, Post, UseGuards } from "@nestjs/common";
import { ApiOkResponse } from "@nestjs/swagger";
import { WebSocketStsDto } from "./dtos/ws-sts.dto";
import ReqCredential from "@/auth/web/arena-web-credential.decorator";
import type ArenaWebCredential from "@/auth/web/arena-web-credential";
import { AuthService } from "./auth.service";

@Controller("api/v1/auth")
@UseGuards(ArenaWebAuthGuard)
export class AuthController {
  constructor(
    private readonly authService: AuthService,
  ) {}

  @Post("ws/token")
  @ApiOkResponse({ type: () => withApiResult(WebSocketStsDto) })
  async issueWebSocketSTS(@ReqCredential() credential: ArenaWebCredential): Promise<ApiResultDto<WebSocketStsDto>> {
    const sts = await this.authService.issueWebSocketSTS(credential.user!);

    return new ApiResultDto<WebSocketStsDto>({ data: { sts } });
  }
}