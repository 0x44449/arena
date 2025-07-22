import { AuthGuard } from "@/guards/auth.guard";
import { Controller, Get, Param, Post, Res, UploadedFile, UseGuards, UseInterceptors } from "@nestjs/common";
import { ApiBearerAuth } from "@nestjs/swagger";
import { FilesService } from "./files.service";
import { ArenaFileInterceptor } from "@/commons/file-uploader/arena-file-interceptor";
import { ApiMultipartBody } from "@/decorators/api-multipart-body.decorator";
import { ApiOkResponseWith } from "@/decorators/api-ok-response-with.decorator";
import { ApiResultDto } from "@/dtos/api-result.dto";
import { FileDto } from "@/dtos/file.dto";
import ReqCred from "@/decorators/req-cred.decorator";
import ArenaCredential from "@/commons/arena-credential";
import { AllowPublic } from "@/decorators/allow-public.decorator";
import { join } from "path";
import * as fs from "fs";
import { Response } from "express";
import { ApiOkResponseBinary } from "@/decorators/api-ok-response-binary.decorator";

@Controller('api/v1/files')
@UseGuards(AuthGuard)
@ApiBearerAuth('access-token')
export class FilesController {
  constructor(
    private readonly filesService: FilesService,
  ) {}

  @AllowPublic()
  @Get('download/:fileId')
  @ApiOkResponseBinary()
  async downloadFile(@Param('fileId') fileId: string, @Res() response: Response): Promise<Response> {
    const file = await this.filesService.findFileByFileId(fileId);
    if (!file) {
      throw new Error('File not found');
    }

    const filePath = join(file.path, file.storedName);
    if (!fs.existsSync(filePath)) {
      throw new Error('File does not exist on server');
    }

    const stream = fs.createReadStream(filePath);
    response.setHeader('Content-Type', file.mimeType);
    response.setHeader('Content-Disposition', `attachment; filename="${encodeURIComponent(file.originalName)}"`);
    return stream.pipe(response);
  }
  
  @Post()
  @UseInterceptors(ArenaFileInterceptor())
  @ApiMultipartBody()
  @ApiOkResponseWith(FileDto)
  async uploadFile(@UploadedFile() file: Express.Multer.File, @ReqCred() credential: ArenaCredential): Promise<ApiResultDto<FileDto>> {
    const savedFile = await this.filesService.uploadFile(file, credential.user);

    const result = new ApiResultDto<FileDto>({ data: FileDto.fromEntity(savedFile) });
    return result;
  }
}