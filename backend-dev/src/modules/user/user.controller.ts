import { Controller, Get, Patch, Post } from "@nestjs/common";

@Controller("api/v1/user")
export class UserController {
  @Post("register")
  registerUser(): string {
    return "user registered";
  }

  @Get("me")
  getUserInfo(): string {
    return "user info";
  }

  @Patch("me")
  updateUserInfo(): string {
    return "user info updated";
  }

  @Patch("me/avatar")
  uploadUserAvatar(): string {
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