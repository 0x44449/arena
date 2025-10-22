import { AllowPublic } from "@/auth/allow-public.decorator";
import { withResponseBinaryOption } from "@/utils/swagger/decorator-helper";
import { Controller, Get, Post, UploadedFile, UploadedFiles, UseGuards } from "@nestjs/common";
import { ApiBody, ApiConsumes, ApiOkResponse } from "@nestjs/swagger";
import { UploadFileDto } from "./dtos/upload-file.dto";
import { UploadFilesDto } from "./dtos/upload-files.dto";
import ReqCredential from "@/auth/web/arena-web-credential.decorator";
import type ArenaWebCredential from "@/auth/web/arena-web-credential";
import { withApiResult } from "@/dtos/api-result.dto";
import { FileDto } from "@/dtos/file.dto";
import { ArenaWebAuthGuard } from "@/auth/web/arena-web-auth-guard";

@Controller("api/v1/files")
@UseGuards(ArenaWebAuthGuard)
export class FileController {
  @AllowPublic()
  @Get("contents/:fileId")
  @ApiOkResponse(withResponseBinaryOption())
  getFile(): string {
    return "File details";
  }

  @Post("upload")
  @ApiConsumes("multipart/form-data")
  @ApiBody({ type: UploadFileDto })
  @ApiOkResponse({ type: () => withApiResult(FileDto) })
  uploadFile(@UploadedFile() file: Express.Multer.File, @ReqCredential() credential: ArenaWebCredential): string {
    return "File uploaded";
  }

  @Post("upload/multiple")
  @ApiConsumes("multipart/form-data")
  @ApiBody({ type: UploadFilesDto })
  @ApiOkResponse({ type: () => withApiResult(Array<FileDto>) })
  uploadMultipleFiles(@UploadedFiles() files: Express.Multer.File[], @ReqCredential() credential: ArenaWebCredential): string {
    return "Multiple files uploaded";
  }
}