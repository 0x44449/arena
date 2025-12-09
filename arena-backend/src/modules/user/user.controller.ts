import { Body, Controller, Get, Param, Patch, Post, UseGuards } from "@nestjs/common";
import { UserDto } from "src/dtos/user.dto";
import { UpdateUserDto } from "./dtos/update-user.dto";
import { CreateUserDto } from "./dtos/create-user.dto";
import { ApiBearerAuth, ApiOkResponse } from "@nestjs/swagger";
import { ArenaJwtAuthGuard } from "src/guards/arena-jwt-auth-guard";
import { withSingleApiResult, type SingleApiResultDto } from "src/dtos/single-api-result.dto";

@Controller("/api/v1/users")
@UseGuards(ArenaJwtAuthGuard)
@ApiBearerAuth()
export class UserController {
  constructor() { }

  @Get("/me")
  @ApiOkResponse({ type: () => withSingleApiResult(UserDto, { nullable: true }) })
  async getMe(): Promise<SingleApiResultDto<UserDto | null>> {
    return {
      success: true,
      data: null,
      errorCode: null,
    }
  }

  @Get("/tag/:tag")
  @ApiOkResponse({ type: () => withSingleApiResult(UserDto, { nullable: true }) })
  async getUserByTag(@Param("tag") tag: string): Promise<SingleApiResultDto<UserDto | null>> {
    return {
      success: true,
      data: null,
      errorCode: null,
    }
  }

  @Patch("/tag/:tag")
  @ApiOkResponse({ type: () => withSingleApiResult(UserDto, { nullable: true }) })
  async updateUserByTag(
    @Param("tag") tag: string, @Body() updateUserDto: UpdateUserDto
  ): Promise<SingleApiResultDto<UserDto | null>> {
    return {
      success: true,
      data: null,
      errorCode: null,
    }
  }

  @Post("")
  @ApiOkResponse({ type: () => withSingleApiResult(UserDto) })
  async createUser(@Body() createUserDto: CreateUserDto): Promise<SingleApiResultDto<UserDto>> {
    return {
      success: true,
      data: {
        tag: '',
        name: '',
        avatarUrl: '',
      },
      errorCode: null,
    }
  }
}