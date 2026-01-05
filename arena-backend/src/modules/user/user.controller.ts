import { Body, Controller, Get, Param, Patch, Post, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiTags } from "@nestjs/swagger";
import { ArenaJwtAuthGuard } from "src/guards/arena-jwt-auth-guard";
import { SessionGuard } from "../session/session.guard";
import { UserDto } from "src/dtos/user.dto";
import { UpdateUserDto } from "./dtos/update-user.dto";
import { CreateUserDto } from "./dtos/create-user.dto";
import { withSingleApiResult, type SingleApiResultDto } from "src/dtos/single-api-result.dto";
import { UserService } from "./user.service";
import { JwtPayloadParam } from "src/decorators/jwt-payload.decorator";
import { CurrentUser } from "src/decorators/current-user.decorator";
import { toUserDto } from "src/utils/user.mapper";
import { toFileDto } from "src/utils/file.mapper";
import { S3Service } from "../file/s3.service";
import type { JwtPayload } from "src/types/jwt-payload.interface";
import type { CachedUser } from "../session/session.types";

@ApiTags("users")
@Controller("/api/v1/users")
@UseGuards(ArenaJwtAuthGuard)
@ApiBearerAuth()
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly s3Service: S3Service,
  ) {}

  @Get("/me")
  @ApiOperation({ summary: "내 정보 조회" })
  @ApiOkResponse({ type: () => withSingleApiResult(UserDto, { nullable: true }) })
  async getMe(@JwtPayloadParam() jwt: JwtPayload): Promise<SingleApiResultDto<UserDto | null>> {
    const entity = await this.userService.findByUid(jwt.uid);
    if (!entity) {
      return { success: true, data: null, errorCode: null };
    }

    const avatar = entity.avatar
      ? await toFileDto(entity.avatar, this.s3Service)
      : null;

    return {
      success: true,
      data: toUserDto(entity, avatar),
      errorCode: null,
    };
  }

  @Get("/:userId")
  @UseGuards(SessionGuard)
  @ApiOperation({ summary: "유저 조회" })
  @ApiOkResponse({ type: () => withSingleApiResult(UserDto) })
  async getUser(@Param("userId") userId: string): Promise<SingleApiResultDto<UserDto>> {
    const entity = await this.userService.getByUserId(userId);

    const avatar = entity.avatar
      ? await toFileDto(entity.avatar, this.s3Service)
      : null;

    return {
      success: true,
      data: toUserDto(entity, avatar),
      errorCode: null,
    };
  }

  @Patch("/me")
  @UseGuards(SessionGuard)
  @ApiOperation({ summary: "내 정보 수정" })
  @ApiOkResponse({ type: () => withSingleApiResult(UserDto) })
  async updateMe(
    @CurrentUser() user: CachedUser,
    @Body() updateUserDto: UpdateUserDto
  ): Promise<SingleApiResultDto<UserDto>> {
    const entity = await this.userService.update(user.userId, updateUserDto);

    const avatar = entity.avatar
      ? await toFileDto(entity.avatar, this.s3Service)
      : null;

    return {
      success: true,
      data: toUserDto(entity, avatar),
      errorCode: null,
    };
  }

  @Post("")
  @ApiOperation({ summary: "회원가입" })
  @ApiOkResponse({ type: () => withSingleApiResult(UserDto) })
  async createUser(
    @JwtPayloadParam() jwt: JwtPayload,
    @Body() createUserDto: CreateUserDto
  ): Promise<SingleApiResultDto<UserDto>> {
    const entity = await this.userService.create(jwt.uid, createUserDto);

    const avatar = entity.avatar
      ? await toFileDto(entity.avatar, this.s3Service)
      : null;

    return {
      success: true,
      data: toUserDto(entity, avatar),
      errorCode: null,
    };
  }
}
