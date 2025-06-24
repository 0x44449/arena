import { AuthGuard } from "@/auth/auth.guard";
import { Body, Controller, Get, Param, Post, Put, Res, UploadedFile, UseGuards, UseInterceptors } from "@nestjs/common";
import { ApiBearerAuth, ApiBody, ApiConsumes } from "@nestjs/swagger";
import { UserService } from "./user.service";
import { ApiOkResponseWithResult } from "@/common/decorator/api-ok-response-with-result";
import { PublicUserDto } from "@/dto/public-user.dto";
import { ApiResult } from "@/dto/api-result.dto";
import ArenaCredential from "@/auth/arena-credential";
import { FromCredential } from "@/auth/credential.decorator";
import { UpdateUserDto } from "./dto/update-user.dto";
import { FileInterceptor } from "@nestjs/platform-express";
import { diskStorage } from "multer";
import { randomUUID } from "crypto";
import { FileService } from "@/file/file.service";
import { FileDto } from "@/dto/file.dto";
import { extname, join } from "path";
import * as fs from "fs";
import { Response } from "express";

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

  @Post('me/avatar')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: (req, file, callback) => {
          const uploadPath = join(process.cwd(), FileService.getServerRelativePath());
          callback(null, uploadPath);
        },
        filename: (req, file, callback) => {
          const uniqueSuffix = randomUUID();
          const fileExtension = extname(file.originalname);
          callback(null, uniqueSuffix + fileExtension);
        },
      })
    })
  )
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
  @ApiOkResponseWithResult(FileDto)
  async uploadAvatar(
    @UploadedFile() file: Express.Multer.File, @FromCredential() credential: ArenaCredential
  ): Promise<ApiResult<FileDto>> {
    const fileDto = await this.fileService.saveUploadedFile(file, credential.userId);

    const result = new ApiResult<FileDto>({ data: fileDto });
    return result;
  }

  @Get(':userId/avatar/thumbnail')
  async getAvatarThumbnail(@Param('userId') userId: string, @Res() res: Response): Promise<void> {
    const file = await this.userService.getAvatarFileByUserId(userId);
    if (!file) {
      throw new Error("Avatar file not found");
    }

    const filePath = join(process.cwd(), file.path, file.storedName);
    if (!fs.existsSync(filePath)) {
      throw new Error("Avatar file does not exist");
    }

    res.setHeader('Content-Disposition', 'inline; filename="thumbnail.png"');
    res.sendFile(filePath);
  }
}