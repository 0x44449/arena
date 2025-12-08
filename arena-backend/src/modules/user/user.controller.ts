import { Body, Controller, Get, Param, Patch, Post, UseGuards } from "@nestjs/common";
import { UserDto } from "src/dtos/user.dto";
import { UpdateUserDto } from "./dtos/update-user.dto";
import { CreateUserDto } from "./dtos/create-user.dto";
import { ApiBearerAuth } from "@nestjs/swagger";
import { ArenaJwtAuthGuard } from "src/guards/arena-jwt-auth-guard";

@Controller("/api/v1/users")
@UseGuards(ArenaJwtAuthGuard)
@ApiBearerAuth()
export class UserController {
  constructor() { }

  @Get("/tag/:tag")
  async getUserByTag(@Param("tag") tag: string): Promise<UserDto | null> {
    return null;
  }

  @Patch("/tag/:tag")
  async updateUserByTag(
    @Param("tag") tag: string, @Body() updateUserDto: UpdateUserDto
  ): Promise<UserDto | null> {
    return null;
  }

  @Post("")
  async createUser(@Body() createUserDto: CreateUserDto): Promise<UserDto> {
    return {
      tag: "user#1234",
      name: "New User",
      avatarUrl: "https://example.com/avatar.png",
    }
  }
}