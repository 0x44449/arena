import { Body, Controller, Get, Param, Patch, Post, UseGuards } from "@nestjs/common";
import { UserService } from "./user.service";
import { CreateUserDto } from "./dtos/create-user.dto";
import { AuthGuard } from "@/auth/auth-guard";
import type ArenaWebCredential from "@/auth/arena-web-credential";
import ReqCredential from "@/auth/arena-credential.decorator";
import { AllowOnlyToken } from "@/auth/allow-only-token.decorator";
import { UserDto } from "@/dtos/user.dto";
import { ApiResultDto, withApiResult } from "@/dtos/api-result.dto";
import { ApiOkResponse } from "@nestjs/swagger";
import { UpdateUserDto } from "./dtos/update-user.dto";
import { WellKnownError } from "@/exceptions/well-known-error";

@Controller("api/v1/users")
@UseGuards(AuthGuard)
export class UserController {
  constructor(
    private readonly userService: UserService,
  ) {}

  @Post("register")
  @ApiOkResponse({ type: withApiResult(UserDto) })
  @AllowOnlyToken()
  async registerUser(@Body() body: CreateUserDto, @ReqCredential() credential: ArenaWebCredential): Promise<ApiResultDto<UserDto>> {
    const user = await this.userService.createUser({
      uid: credential.payload.sub!,
      email: credential.payload.email,
      displayName: body.displayName,
    });

    return new ApiResultDto<UserDto>({
      success: true,
      data: UserDto.fromEntity(user),
    });
  }

  @Get("me")
  @ApiOkResponse({ type: withApiResult(UserDto) })
  async getUserInfo(@ReqCredential() credential: ArenaWebCredential): Promise<ApiResultDto<UserDto>> {
    const user = await this.userService.findUserByUserId(credential.user!.userId);
    if (!user) {
      throw new WellKnownError({
        message: "User not found",
        errorCode: "USER_NOT_FOUND",
      });
    }

    return new ApiResultDto<UserDto>({
      success: true,
      data: UserDto.fromEntity(user),
    });
  }

  @Patch("me")
  @ApiOkResponse({ type: withApiResult(UserDto) })
  async updateUserInfo(@Body() body: UpdateUserDto, @ReqCredential() credential: ArenaWebCredential): Promise<ApiResultDto<UserDto>> {
    const user = await this.userService.updateUser(credential.user!.userId, body);

    return new ApiResultDto<UserDto>({
      success: true,
      data: UserDto.fromEntity(user),
    });
  }

  @Patch("me/avatar")
  uploadUserAvatar(@ReqCredential() credential: ArenaWebCredential): string {
    return "user avatar uploaded";
  }

  @Get(":userId")
  @ApiOkResponse({ type: withApiResult(UserDto) })
  async getUserInfoById(@Param('userId') userId: string): Promise<ApiResultDto<UserDto>> {
    const user = await this.userService.findUserByUserId(userId);
    if (!user) {
      throw new WellKnownError({
        message: "User not found",
        errorCode: "USER_NOT_FOUND",
      });
    }

    return new ApiResultDto<UserDto>({
      success: true,
      data: UserDto.fromEntity(user),
    });
  }

  @Get(":userId/avatar/thumbnail.png")
  getUserAvatarThumbnail(): string {
    return "user avatar thumbnail";
  }
}