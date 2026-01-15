import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { ArenaJwtAuthGuard } from 'src/guards/arena-jwt-auth-guard';
import { SessionGuard } from '../session/session.guard';
import { UserDto } from 'src/dtos/user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { CreateUserDto } from './dtos/create-user.dto';
import {
  withSingleApiResult,
  type SingleApiResultDto,
} from 'src/dtos/single-api-result.dto';
import { UserService } from './user.service';
import { JwtPayloadParam } from 'src/decorators/jwt-payload.decorator';
import { CurrentUser } from 'src/decorators/current-user.decorator';
import { toUserDto } from 'src/utils/user.mapper';
import type { JwtPayload } from 'src/types/jwt-payload.interface';
import type { CachedUser } from '../session/session.types';

@ApiTags('users')
@Controller('/api/v1/users')
@UseGuards(ArenaJwtAuthGuard)
@ApiBearerAuth()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('/me')
  @ApiOperation({ summary: '내 정보 조회', operationId: 'getMe' })
  @ApiOkResponse({
    type: () => withSingleApiResult(UserDto, { nullable: true }),
  })
  async getMe(
    @JwtPayloadParam() jwt: JwtPayload,
  ): Promise<SingleApiResultDto<UserDto | null>> {
    const entity = await this.userService.findByUid(jwt.uid);
    if (!entity) {
      return { success: true, data: null, errorCode: null };
    }

    return {
      success: true,
      data: toUserDto(entity),
      errorCode: null,
    };
  }

  @Get('/:userId')
  @UseGuards(SessionGuard)
  @ApiOperation({ summary: '유저 조회', operationId: 'getUser' })
  @ApiOkResponse({ type: () => withSingleApiResult(UserDto) })
  async getUser(
    @Param('userId') userId: string,
  ): Promise<SingleApiResultDto<UserDto>> {
    const entity = await this.userService.getByUserId(userId);

    return {
      success: true,
      data: toUserDto(entity),
      errorCode: null,
    };
  }

  @Patch('/me')
  @UseGuards(SessionGuard)
  @ApiOperation({ summary: '내 정보 수정', operationId: 'updateMe' })
  @ApiOkResponse({ type: () => withSingleApiResult(UserDto) })
  async updateMe(
    @CurrentUser() user: CachedUser,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<SingleApiResultDto<UserDto>> {
    const entity = await this.userService.update(user.userId, updateUserDto);

    return {
      success: true,
      data: toUserDto(entity),
      errorCode: null,
    };
  }

  @Post('')
  @ApiOperation({ summary: '회원가입', operationId: 'createUser' })
  @ApiOkResponse({ type: () => withSingleApiResult(UserDto) })
  async createUser(
    @JwtPayloadParam() jwt: JwtPayload,
    @Body() createUserDto: CreateUserDto,
  ): Promise<SingleApiResultDto<UserDto>> {
    const entity = await this.userService.create(jwt.uid, createUserDto);

    return {
      success: true,
      data: toUserDto(entity),
      errorCode: null,
    };
  }
}
