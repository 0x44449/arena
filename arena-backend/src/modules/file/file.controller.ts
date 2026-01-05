import {
  Controller,
  Post,
  Get,
  Delete,
  Param,
  Body,
  UseGuards,
} from "@nestjs/common";
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiTags } from "@nestjs/swagger";
import { ArenaJwtAuthGuard } from "src/guards/arena-jwt-auth-guard";
import { SessionGuard } from "../session/session.guard";
import { CurrentUser } from "src/decorators/current-user.decorator";
import { FileService } from "./file.service";
import { withSingleApiResult, type SingleApiResultDto } from "src/dtos/single-api-result.dto";
import { FileDto } from "src/dtos/file.dto";
import { ApiResultDto } from "src/dtos/api-result.dto";
import { GetPresignedUrlDto } from "./dtos/get-presigned-url.dto";
import { PresignedUrlDto } from "./dtos/presigned-url.dto";
import { CreateFileDto } from "./dtos/create-file.dto";
import { toFileDto } from "src/utils/file.mapper";
import type { CachedUser } from "../session/session.types";

@ApiTags("files")
@Controller("/api/v1/files")
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @Post("presigned-url")
  @UseGuards(ArenaJwtAuthGuard, SessionGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "파일 업로드 URL 발급" })
  @ApiOkResponse({ type: () => withSingleApiResult(PresignedUrlDto) })
  async getPublicPresignedUrl(
    @CurrentUser() user: CachedUser,
    @Body() dto: GetPresignedUrlDto
  ): Promise<SingleApiResultDto<PresignedUrlDto>> {
    const result = await this.fileService.generatePresignedUrl(
      user.userId,
      "public",
      dto.directory,
      dto.fileExtension,
      dto.mimeType
    );
    return { success: true, data: result, errorCode: null };
  }

  @Post("")
  @UseGuards(ArenaJwtAuthGuard, SessionGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "파일 생성" })
  @ApiOkResponse({ type: () => withSingleApiResult(FileDto) })
  async createPublicFile(
    @CurrentUser() user: CachedUser,
    @Body() dto: CreateFileDto
  ): Promise<SingleApiResultDto<FileDto>> {
    const file = await this.fileService.createFile(user.userId, "public", dto);
    return { success: true, data: toFileDto(file), errorCode: null };
  }

  @Post("private/presigned-url")
  @UseGuards(ArenaJwtAuthGuard, SessionGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Private 파일 업로드 URL 발급" })
  @ApiOkResponse({ type: () => withSingleApiResult(PresignedUrlDto) })
  async getPrivatePresignedUrl(
    @CurrentUser() user: CachedUser,
    @Body() dto: GetPresignedUrlDto
  ): Promise<SingleApiResultDto<PresignedUrlDto>> {
    const result = await this.fileService.generatePresignedUrl(
      user.userId,
      "private",
      dto.directory,
      dto.fileExtension,
      dto.mimeType
    );
    return { success: true, data: result, errorCode: null };
  }

  @Post("private")
  @UseGuards(ArenaJwtAuthGuard, SessionGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Private 파일 생성" })
  @ApiOkResponse({ type: () => withSingleApiResult(FileDto) })
  async createPrivateFile(
    @CurrentUser() user: CachedUser,
    @Body() dto: CreateFileDto
  ): Promise<SingleApiResultDto<FileDto>> {
    const file = await this.fileService.createFile(user.userId, "private", dto);
    return { success: true, data: toFileDto(file), errorCode: null };
  }

  @Get(":fileId")
  @ApiOperation({ summary: "파일 조회" })
  @ApiOkResponse({ type: () => withSingleApiResult(FileDto) })
  async getFile(@Param("fileId") fileId: string): Promise<SingleApiResultDto<FileDto>> {
    const file = await this.fileService.getFileById(fileId);
    return { success: true, data: toFileDto(file), errorCode: null };
  }

  @Delete(":fileId")
  @UseGuards(ArenaJwtAuthGuard, SessionGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "파일 삭제" })
  @ApiOkResponse({ type: ApiResultDto })
  async deleteFile(
    @CurrentUser() user: CachedUser,
    @Param("fileId") fileId: string
  ): Promise<ApiResultDto> {
    await this.fileService.deleteFile(fileId, user.userId);
    return { success: true, errorCode: null };
  }
}
