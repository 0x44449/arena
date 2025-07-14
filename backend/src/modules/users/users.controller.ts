import { Body, Controller, Get, Post, UseGuards } from "@nestjs/common";
import { UsersService } from "./users.service";
import ReqCred from "@/decorators/req-cred.decorator";
import ArenaCredential from "@/commons/arena-credential";
import { UserDto } from "@/dtos/user.dto";
import { ApiOkResponseWith } from "@/decorators/api-ok-response-with.decorator";
import { AuthGuard } from "@/guards/auth.guard";
import { ApiResult } from "@/dtos/api-result.dto";
import { AllowPublic } from "@/decorators/allow-public.decorator";
import { RegisterUserDto } from "./dto/register-user.dto";

@Controller('api/v1/users')
@UseGuards(AuthGuard)
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
  ) {}

  @Post('')
  @AllowPublic()
  @ApiOkResponseWith(UserDto)
  async register(@Body() dto: RegisterUserDto): Promise<ApiResult<UserDto>> {
    const user = await this.usersService.registerUser(dto);
    return new ApiResult<UserDto>({ data: UserDto.fromEntity(user) });
  }

  @Get('me')
  @ApiOkResponseWith(UserDto)
  async getMe(@ReqCred() credential: ArenaCredential): Promise<ApiResult<UserDto | null>> {
    const user = await this.usersService.findUserByUid(credential.user.uid);
    const result = new ApiResult<UserDto | null>({ data: user ? UserDto.fromEntity(user) : null });
    return result;
  }
}