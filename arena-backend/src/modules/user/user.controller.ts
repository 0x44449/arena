import { Body, Controller, Get, Param, Patch, Post, UseGuards } from "@nestjs/common";
import { UserDto } from "src/dtos/user.dto";
import { UpdateUserDto } from "./dtos/update-user.dto";
import { CreateUserDto } from "./dtos/create-user.dto";
import { ApiBearerAuth, ApiOkResponse } from "@nestjs/swagger";
import { ArenaJwtAuthGuard } from "src/guards/arena-jwt-auth-guard";
import { withSingleApiResult, type SingleApiResultDto } from "src/dtos/single-api-result.dto";
import { UserService } from "./user.service";
import { CurrentUser } from "src/decorators/current-user.decorator";
import { toUserDto } from "src/utils/user.mapper";
import type { JwtPayload } from "src/types/jwt-payload.interface";

@Controller("/api/v1/users")
@UseGuards(ArenaJwtAuthGuard)
@ApiBearerAuth()
export class UserController {
  constructor(
    private readonly userService: UserService,
  ) { }

  @Get("/me")
  @ApiOkResponse({ type: () => withSingleApiResult(UserDto, { nullable: true }) })
  async getMe(@CurrentUser() user: JwtPayload): Promise<SingleApiResultDto<UserDto | null>> {
    const userEntity = await this.userService.findByUid(user.uid);
    return {
      success: true,
      data: userEntity ? toUserDto(userEntity) : null,
      errorCode: null,
    };
  }

  @Get("/tag/:tag")
  @ApiOkResponse({ type: () => withSingleApiResult(UserDto, { nullable: true }) })
  async getUserByTag(@Param("tag") tag: string): Promise<SingleApiResultDto<UserDto | null>> {
    const userEntity = await this.userService.findByUtag(tag);
    return {
      success: true,
      data: userEntity ? toUserDto(userEntity) : null,
      errorCode: null,
    };
  }

  @Patch("/tag/:tag")
  @ApiOkResponse({ type: () => withSingleApiResult(UserDto, { nullable: true }) })
  async updateUserByTag(
    @Param("tag") tag: string, 
    @Body() updateUserDto: UpdateUserDto
  ): Promise<SingleApiResultDto<UserDto | null>> {
    const userEntity = await this.userService.update(tag, updateUserDto);
    return {
      success: true,
      data: userEntity ? toUserDto(userEntity) : null,
      errorCode: null,
    };
  }

  @Post("")
  @ApiOkResponse({ type: () => withSingleApiResult(UserDto) })
  async createUser(
    @CurrentUser() user: JwtPayload,
    @Body() createUserDto: CreateUserDto
  ): Promise<SingleApiResultDto<UserDto>> {
    const userEntity = await this.userService.create(user.uid, createUserDto);
    return {
      success: true,
      data: toUserDto(userEntity),
      errorCode: null,
    };
  }
}
