import { Controller, Get, Param, Res, UseGuards } from "@nestjs/common";
import { FileService } from "./file.service";
import { AuthGuard } from "@/auth/auth.guard";
import { ApiBearerAuth } from "@nestjs/swagger";
import { createReadStream } from "fs";
import { Response } from "express";
import { join } from "path";

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
}