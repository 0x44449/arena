import { Body, Controller, Get, Param, Patch, Post, Res, UseGuards, UseInterceptors } from "@nestjs/common";
import { UserService } from "./user.service";
import { CreateUserDto } from "./dtos/create-user.dto";
import { ArenaWebAuthGuard } from "@/auth/web/arena-web-auth-guard";
import type ArenaWebCredential from "@/auth/web/arena-web-credential";
import ReqCredential from "@/auth/web/arena-web-credential.decorator";
import { AllowOnlyToken } from "@/auth/allow-only-token.decorator";
import { UserDto } from "@/dtos/user.dto";
import { ApiResultDto, withApiResult } from "@/dtos/api-result.dto";
import { ApiBody, ApiConsumes, ApiOkResponse } from "@nestjs/swagger";
import { UpdateUserDto } from "./dtos/update-user.dto";
import { WellKnownError } from "@/exceptions/well-known-error";
import { AllowPublic } from "@/auth/allow-public.decorator";
import { withResponseBinaryOptions } from "@/libs/swagger/decorator-helper";
import { UploadUserAvatarDto } from "./dtos/upload-user-avatar.dto";
import { ArenaWebFileInterceptor } from "@/libs/file/arena-web-file-interceptor";
import type { Response } from "express";
import * as fs from "fs";
import { join } from "path";

@Controller("api/v1/users")
@UseGuards(ArenaWebAuthGuard)
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
  @ApiConsumes("multipart/form-data")
  @UseInterceptors(ArenaWebFileInterceptor.singleMemory())
  @ApiOkResponse({ type: withApiResult(UserDto) })
  @ApiBody({ type: UploadUserAvatarDto })
  async uploadUserAvatar(@Body() file: Express.Multer.File, @ReqCredential() credential: ArenaWebCredential): Promise<ApiResultDto<UserDto>> {
    const user = await this.userService.uploadUserAvatar(file, credential.user!);

    return new ApiResultDto<UserDto>({ data: UserDto.fromEntity(user) });
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

  @AllowPublic()
  @Get(":userId/avatar/thumbnail.png")
  @ApiOkResponse(withResponseBinaryOptions())
  async getUserAvatarThumbnail(@Param('userId') userId: string, @Res() response: Response): Promise<Response> {
    const file = await this.userService.getUserAvatarByUserId(userId);
    if (!file) {
      return response.status(404).send();
    }

    const filePath = join(file.path, file.storedName);
    if (!fs.existsSync(filePath)) {
      return response.status(404).send();
    }

    const stream = fs.createReadStream(filePath);
    response.setHeader("Content-Type", file.mimeType);
    // response.setHeader("Content-Disposition", `inline; filename="thumbnail.png"`);
    response.setHeader("Content-Disposition", "inline");
    return stream.pipe(response);
  }
}