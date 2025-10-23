import { AllowPublic } from "@/auth/allow-public.decorator";
import { withResponseBinaryOptions } from "@/libs/swagger/decorator-helper";
import { Controller, Delete, Get, Param, Post, Res, UploadedFile, UploadedFiles, UseGuards } from "@nestjs/common";
import { ApiBody, ApiConsumes, ApiOkResponse } from "@nestjs/swagger";
import { UploadFileDto } from "./dtos/upload-file.dto";
import { UploadFilesDto } from "./dtos/upload-files.dto";
import ReqCredential from "@/auth/web/arena-web-credential.decorator";
import type ArenaWebCredential from "@/auth/web/arena-web-credential";
import { ApiResultDto, withApiResult } from "@/dtos/api-result.dto";
import { FileDto } from "@/dtos/file.dto";
import { ArenaWebAuthGuard } from "@/auth/web/arena-web-auth-guard";
import type { Response } from "express";
import { FileService } from "./file.service";
import { join } from "path";
import * as fs from "fs";

@Controller("api/v1/files")
@UseGuards(ArenaWebAuthGuard)
export class FileController {
  constructor(
    private readonly fileService: FileService,
  ) {}

  @AllowPublic()
  @Get(":fileId")
  @ApiOkResponse(withResponseBinaryOptions())
  async getFile(@Param("fileId") fileId: string, @Res() response: Response): Promise<Response> {
    const file = await this.fileService.findFileById(fileId);
    if (!file) {
      return response.status(404).send();
    }
    
    const filePath = join(file.path, file.storedName);
    if (!fs.existsSync(filePath)) {
      return response.status(404).send();
    }

    const stream = fs.createReadStream(filePath);
    response.setHeader("Content-Type", file.mimeType);
    response.setHeader("Content-Disposition", `attachment; filename="${encodeURIComponent(file.originalName)}"`);
    return stream.pipe(response);
  }

  @Delete(":fileId")
  @ApiOkResponse({ type: () => withApiResult(Object) })
  async deleteFile(@Param("fileId") fileId: string, @ReqCredential() credential: ArenaWebCredential): Promise<ApiResultDto<null>> {
    await this.fileService.deleteFile(fileId, credential.user!);
    
    return new ApiResultDto<null>({ data: null });
  }

  @Post("upload")
  @ApiConsumes("multipart/form-data")
  @ApiBody({ type: UploadFileDto })
  @ApiOkResponse({ type: () => withApiResult(FileDto) })
  async uploadFile(@UploadedFile() file: Express.Multer.File, @ReqCredential() credential: ArenaWebCredential): Promise<ApiResultDto<FileDto>> {
    const uploaded = await this.fileService.uploadFile(file, credential.user!);

    return new ApiResultDto<FileDto>({ data: FileDto.fromEntity(uploaded) });
  }
  
  @Post("upload/multiple")
  @ApiConsumes("multipart/form-data")
  @ApiBody({ type: UploadFilesDto })
  @ApiOkResponse({ type: () => withApiResult(Array<FileDto>) })
  async uploadMultipleFiles(@UploadedFiles() files: Express.Multer.File[], @ReqCredential() credential: ArenaWebCredential): Promise<ApiResultDto<FileDto[]>> {
    const uploaded = await this.fileService.uploadFiles(files, credential.user!);

    return new ApiResultDto<FileDto[]>({ data: uploaded.map(file => FileDto.fromEntity(file)) });
  }
}