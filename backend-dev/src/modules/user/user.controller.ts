import { Body, Controller, Get, Patch, Post, UseGuards } from "@nestjs/common";
import { UserService } from "./user.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { AuthGuard } from "@/auth/auth-guard";
import type ArenaWebCredential from "@/auth/arena-web-credential";
import ReqCredential from "@/auth/arena-credential.decorator";
import { AllowOnlyToken } from "@/auth/allow-only-token.decorator";

@Controller("api/v1/user")
@UseGuards(AuthGuard)
export class UserController {
  constructor(
    private readonly userService: UserService,
  ) {}

  @Post("register")
  @AllowOnlyToken()
  async registerUser(@Body() body: CreateUserDto): Promise<string> {
    const user = await this.userService.createUser(body);
    return "user registered";
  }

  @Get("me")
  getUserInfo(@ReqCredential() credential: ArenaWebCredential): string {
    return "user info";
  }

  @Patch("me")
  updateUserInfo(@ReqCredential() credential: ArenaWebCredential): string {
    return "user info updated";
  }

  @Patch("me/avatar")
  uploadUserAvatar(@ReqCredential() credential: ArenaWebCredential): string {
    return "user avatar uploaded";
  }

  @Get(":userId")
  getUserInfoById(): string {
    return "user info by id";
  }

  @Get(":userId/avatar/thumbnail.png")
  getUserAvatarThumbnail(): string {
    return "user avatar thumbnail";
  }
}