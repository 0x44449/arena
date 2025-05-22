import { Controller, Get, Param, Post, Res, UploadedFile, UseGuards, UseInterceptors } from "@nestjs/common";
import { FileService } from "./file.service";
import { AuthGuard } from "@/auth/auth.guard";
import { ApiBearerAuth, ApiBody, ApiConsumes } from "@nestjs/swagger";
import { createReadStream } from "fs";
import { Response } from "express";
import { extname, join } from "path";
import { FileInterceptor } from "@nestjs/platform-express";
import { diskStorage } from 'multer';
import { randomUUID } from "crypto";
import { FromCredential } from "@/auth/credential.decorator";
import ArenaCredential from "@/auth/arena-credential";
import { ApiResult } from "@/dto/api-result.dto";
import { FileDto } from "@/dto/file.dto";
import { plainToInstance } from "class-transformer";
import { ApiOkResponseWithResult } from "@/common/decorator/api-ok-response-with-result";

@Controller('api/v1/files')
@UseGuards(AuthGuard)
@ApiBearerAuth('access-token')
export class FileController {
  constructor(
    private readonly fileService: FileService,
  ) {}

  @Get('download/:fileId')
  async downloadFile(@Param('fileId') fileId: string, @Res() response: Response): Promise<Response> {
    const file = await this.fileService.getFileByFileId(fileId);
    const pysicalPath = join(process.cwd(), file.path, file.storedName);
    const stream = createReadStream(pysicalPath);

    response.setHeader('Content-Type', file.mimeType);
    response.setHeader('Content-Disposition', `attachment; filename="${encodeURIComponent(file.originalName)}"`);
    return stream.pipe(response);
  }

  @Post()
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
  async uploadFile(
    @UploadedFile() file: Express.Multer.File, @FromCredential() credential: ArenaCredential
  ): Promise<ApiResult<FileDto>> {
    const fileDto = await this.fileService.saveUploadedFile(file, credential.userId);

    const result = new ApiResult<FileDto>({ data: fileDto});
    return plainToInstance(ApiResult<FileDto>, result);
  }
}