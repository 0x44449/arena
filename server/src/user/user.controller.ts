import { AuthGuard } from "@/auth/auth.guard";
import { Body, Controller, Get, Param, Patch, Post, Put, Res, UploadedFile, UseGuards, UseInterceptors } from "@nestjs/common";
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOkResponse } from "@nestjs/swagger";
import { UserService } from "./user.service";
import { ApiOkResponseWithResult } from "@/common/decorator/api-ok-response-with-result";
import { PublicUserDto } from "@/dto/public-user.dto";
import { ApiResult } from "@/dto/api-result.dto";
import ArenaCredential from "@/auth/arena-credential";
import { FromCredential } from "@/auth/credential.decorator";
import { UpdateUserDto } from "./dto/update-user.dto";
import { FileInterceptor } from "@nestjs/platform-express";
import { memoryStorage } from "multer";
import { FileService } from "@/file/file.service";
import { join } from "path";
import * as fs from "fs";
import { Response } from "express";
import { AllowPublic } from "@/auth/allow-public.decorator";

@Controller('api/v1/users')
@UseGuards(AuthGuard)
@ApiBearerAuth('access-token')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly fileService: FileService,
  ) {}

  @Get('me')
  @ApiOkResponseWithResult(PublicUserDto)
  async getMe(@FromCredential() credential: ArenaCredential): Promise<ApiResult<PublicUserDto | null>> {
    const user = await this.userService.getUserDtoByUserId(credential.userId);

    const result = new ApiResult<PublicUserDto | null>({ data: user });
    return result;
  }

  @Put('me')
  @ApiOkResponseWithResult(PublicUserDto)
  @ApiBody({ type: UpdateUserDto })
  async updateMe(@Body() param: UpdateUserDto, @FromCredential() credential: ArenaCredential): Promise<ApiResult<PublicUserDto | null>> {
    const user = await this.userService.updateUserDtoByUserId(credential.userId, param);

    const result = new ApiResult<PublicUserDto | null>({ data: user });
    return result;
  }

  @Patch('me/avatar/thumbnail')
  @UseInterceptors(FileInterceptor('file', {
    storage: memoryStorage(),
    limits: { fileSize: 100 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
      if (!file.mimetype.startsWith('image/')) return cb(new Error('image only'), false);
      cb(null, true);
    },
  }))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiOkResponseWithResult(PublicUserDto)
  async updateUserAvatar(
    @UploadedFile() file: Express.Multer.File, @FromCredential() credential: ArenaCredential
  ): Promise<ApiResult<PublicUserDto>> {
    const user = await this.userService.updateUserAvatar(file, credential.userId);

    const result = new ApiResult<PublicUserDto>({ data: user });
    return result;
  }

  @AllowPublic()
  @Get(':userId/avatar/thumbnail.png')
  @ApiOkResponse({
    content: {
      'image/png': {
        schema: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  async getUserAvatar(@Param('userId') userId: string, @Res() res: Response): Promise<void> {
    const file = await this.userService.getAvatarFileByUserId(userId);
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