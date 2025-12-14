import {
  Controller,
  Post,
  Get,
  Delete,
  Param,
  Body,
  UseGuards,
} from "@nestjs/common";
import { ApiBearerAuth, ApiOkResponse, ApiTags } from "@nestjs/swagger";
import { ArenaJwtAuthGuard } from "src/guards/arena-jwt-auth-guard";
import { CurrentUser } from "src/decorators/current-user.decorator";
import { FileService } from "./file.service";
import { S3Service } from "./s3.service";
import { withSingleApiResult, type SingleApiResultDto } from "src/dtos/single-api-result.dto";
import { FileDto } from "src/dtos/file.dto";
import { ApiResultDto } from "src/dtos/api-result.dto";
import { GetPresignedUrlDto } from "./dtos/get-presigned-url.dto";
import { PresignedUrlDto } from "./dtos/presigned-url.dto";
import { CreateFileDto } from "./dtos/create-file.dto";
import { toFileDto } from "src/utils/file.mapper";
import type { JwtPayload } from "src/types/jwt-payload.interface";

@ApiTags("files")
@Controller("/api/v1/files")
export class FileController {
  constructor(
    private readonly fileService: FileService,
    private readonly s3Service: S3Service,
  ) {}

  // ========== Public 파일 (아바타, 그룹 아이콘 등) ==========
  
  @Post("public/presigned-url")
  @UseGuards(ArenaJwtAuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ type: () => withSingleApiResult(PresignedUrlDto) })
  async getPublicPresignedUrl(
    @CurrentUser() user: JwtPayload,
    @Body() dto: GetPresignedUrlDto
  ): Promise<SingleApiResultDto<PresignedUrlDto>> {
    const result = await this.fileService.generatePresignedUrl(
      user.uid,
      'public',
      dto.directory,
      dto.fileExtension,
      dto.mimeType
    );
    return { success: true, data: result, errorCode: null };
  }

  @Post("public")
  @UseGuards(ArenaJwtAuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ type: () => withSingleApiResult(FileDto) })
  async createPublicFile(
    @CurrentUser() user: JwtPayload,
    @Body() dto: CreateFileDto
  ): Promise<SingleApiResultDto<FileDto>> {
    const file = await this.fileService.createFile(user.uid, 'public', dto);
    const fileDto = await toFileDto(file, this.s3Service);
    return { success: true, data: fileDto, errorCode: null };
  }

  // ========== Private 파일 (첨부파일 등) ==========
  
  @Post("private/presigned-url")
  @UseGuards(ArenaJwtAuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ type: () => withSingleApiResult(PresignedUrlDto) })
  async getPrivatePresignedUrl(
    @CurrentUser() user: JwtPayload,
    @Body() dto: GetPresignedUrlDto
  ): Promise<SingleApiResultDto<PresignedUrlDto>> {
    const result = await this.fileService.generatePresignedUrl(
      user.uid,
      'private',
      dto.directory,
      dto.fileExtension,
      dto.mimeType
    );
    return { success: true, data: result, errorCode: null };
  }

  @Post("private")
  @UseGuards(ArenaJwtAuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ type: () => withSingleApiResult(FileDto) })
  async createPrivateFile(
    @CurrentUser() user: JwtPayload,
    @Body() dto: CreateFileDto
  ): Promise<SingleApiResultDto<FileDto>> {
    const file = await this.fileService.createFile(user.uid, 'private', dto);
    const fileDto = await toFileDto(file, this.s3Service);
    return { success: true, data: fileDto, errorCode: null };
  }

  // ========== 공통 (조회/삭제) ==========
  
  @Get(":fileId")
  @ApiOkResponse({ type: () => withSingleApiResult(FileDto) })
  async getFile(@Param("fileId") fileId: string): Promise<SingleApiResultDto<FileDto>> {
    const file = await this.fileService.getFileById(fileId);
    const fileDto = await toFileDto(file, this.s3Service);
    return { success: true, data: fileDto, errorCode: null };
  }

  @Delete(":fileId")
  @UseGuards(ArenaJwtAuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ type: ApiResultDto })
  async deleteFile(
    @CurrentUser() user: JwtPayload,
    @Param("fileId") fileId: string
  ): Promise<ApiResultDto> {
    await this.fileService.deleteFile(fileId, user.uid);
    return { success: true, errorCode: null };
  }
}
