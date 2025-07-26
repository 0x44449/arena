import { Body, Controller, Get, Param, Patch, Post, Res, UseGuards, UseInterceptors } from "@nestjs/common";
import { UsersService } from "./users.service";
import ReqCred from "@/decorators/req-cred.decorator";
import ArenaCredential from "@/commons/arena-credential";
import { UserDto } from "@/dtos/user.dto";
import { ApiOkResponseWith } from "@/decorators/api-ok-response-with.decorator";
import { AuthGuard } from "@/guards/auth.guard";
import { ApiResultDto } from "@/dtos/api-result.dto";
import { AllowPublic } from "@/decorators/allow-public.decorator";
import { ApiBearerAuth, ApiBody } from "@nestjs/swagger";
import { UpdateUserDto } from "./dtos/update-user.dto";
import { UpdateUserProfileDto } from "./dtos/update-user-profile.dto";
import { ApiOkResponseBinary } from "@/decorators/api-ok-response-binary.decorator";
import { Response } from "express";
import { join } from "path";
import * as fs from "fs";
import { ApiMultipartBody } from "@/decorators/api-multipart-body.decorator";
import { ArenaFileImageMemoryInterceptor } from "@/commons/file-uploader/arena-file-image-memory-interceptor";

@Controller('api/v1/users')
@UseGuards(AuthGuard)
@ApiBearerAuth('access-token')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
  ) {}

  @Get('me')
  @ApiOkResponseWith(UserDto)
  async getMe(@ReqCred() credential: ArenaCredential): Promise<ApiResultDto<UserDto | null>> {
    const user = await this.usersService.findUserByUserId(credential.user.userId);

    const result = new ApiResultDto<UserDto | null>({ data: user ? UserDto.fromEntity(user) : null });
    return result;
  }

  @Patch('me')
  @ApiOkResponseWith(UserDto)
  @ApiBody({ type: UpdateUserDto })
  async updateMe(@Body() param: UpdateUserDto, @ReqCred() credential: ArenaCredential): Promise<ApiResultDto<UserDto>> {
    const user = await this.usersService.updateUserByUserId(param, credential.user.userId);

    const result = new ApiResultDto<UserDto>({ data: UserDto.fromEntity(user) });
    return result;
  }

  @Patch('me/profile')
  @ApiOkResponseWith(UserDto)
  @ApiBody({ type: UpdateUserProfileDto })
  async updateProfile(@Body() param: UpdateUserProfileDto, @ReqCred() credential: ArenaCredential,): Promise<ApiResultDto<UserDto>> {
    const user = await this.usersService.updateProfileByUserId(param, credential.user.userId);

    const result = new ApiResultDto<UserDto>({ data: UserDto.fromEntity(user) });
    return result;
  }

  @Patch('me/profile/avatar')
  @UseInterceptors(ArenaFileImageMemoryInterceptor())
  @ApiMultipartBody()
  async updateAvatar(@Body() file: Express.Multer.File, @ReqCred() credential: ArenaCredential): Promise<ApiResultDto<UserDto>> {
    const user = await this.usersService.updateAvatarFileByUserId(file, credential.user.userId);

    const result = new ApiResultDto<UserDto>({ data: UserDto.fromEntity(user) });
    return result;
  }

  @AllowPublic()
  @Get(':userId/avatar/thumbnail.png')
  @ApiOkResponseBinary()
  async getUserAvatar(@Param('userId') userId: string, @Res() res: Response) {
    const file = await this.usersService.getAvatarFileByUserId(userId);
    if (!file) {
      throw new Error("Avatar file not found");
    }

    const filePath = join(file.path, file.storedName);
    if (!fs.existsSync(filePath)) {
      throw new Error("Avatar file does not exist");
    }

    // res.setHeader('Content-Disposition', 'inline; filename="thumbnail.png"');
    res.setHeader('Content-Disposition', 'inline');
    res.setHeader('Content-Type', 'image/png');
    res.sendFile(filePath);
  }
}