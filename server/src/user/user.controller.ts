import { AuthGuard } from "@/auth/auth.guard";
import { Controller, Get, UseGuards } from "@nestjs/common";
import { ApiBearerAuth } from "@nestjs/swagger";
import { UserService } from "./user.service";
import { ApiOkResponseWithResult } from "@/common/decorator/api-ok-response-with-result";
import { PublicUserDto } from "@/dto/public-user.dto";
import { ApiResult } from "@/dto/api-result.dto";
import ArenaCredential from "@/auth/arena-credential";
import { FromCredential } from "@/auth/credential.decorator";

@Controller('api/v1/users')
@UseGuards(AuthGuard)
@ApiBearerAuth('access-token')
export class UserController {
  constructor(
    private readonly userService: UserService,
  ) {}

  @Get('me')
  @ApiOkResponseWithResult(PublicUserDto)
  async getMe(@FromCredential() credential: ArenaCredential): Promise<ApiResult<PublicUserDto | null>> {
    const user = await this.userService.getUserDtoByUserId(credential.userId);

    const result = new ApiResult<PublicUserDto | null>({ data: user });
    return result;
  }
}