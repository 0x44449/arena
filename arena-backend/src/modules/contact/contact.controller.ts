import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
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
import { CurrentUser } from 'src/decorators/current-user.decorator';
import { ContactDto } from 'src/dtos/contact.dto';
import { ApiResultDto } from 'src/dtos/api-result.dto';
import {
  withSingleApiResult,
  type SingleApiResultDto,
} from 'src/dtos/single-api-result.dto';
import {
  withListApiResult,
  type ListApiResultDto,
} from 'src/dtos/list-api-result.dto';
import { CreateContactDto } from './dtos/create-contact.dto';
import { ContactService } from './contact.service';
import { toContactDto } from 'src/utils/contact.mapper';
import type { CachedUser } from '../session/session.types';

@ApiTags('contacts')
@Controller('/api/v1/contacts')
@UseGuards(ArenaJwtAuthGuard, SessionGuard)
@ApiBearerAuth()
export class ContactController {
  constructor(private readonly contactService: ContactService) {}

  @Get()
  @ApiOperation({ summary: '내 연락처 목록 조회' })
  @ApiOkResponse({ type: () => withListApiResult(ContactDto) })
  async getContacts(
    @CurrentUser() user: CachedUser,
  ): Promise<ListApiResultDto<ContactDto>> {
    const contacts = await this.contactService.getContacts(user.userId);

    return {
      success: true,
      data: contacts.map(toContactDto),
      errorCode: null,
    };
  }

  @Post()
  @ApiOperation({ summary: '연락처 추가' })
  @ApiOkResponse({ type: () => withSingleApiResult(ContactDto) })
  async createContact(
    @CurrentUser() user: CachedUser,
    @Body() dto: CreateContactDto,
  ): Promise<SingleApiResultDto<ContactDto>> {
    const contact = await this.contactService.createContact(
      user.userId,
      dto.userId,
    );

    return {
      success: true,
      data: toContactDto(contact),
      errorCode: null,
    };
  }

  @Delete(':userId')
  @ApiOperation({ summary: '연락처 삭제' })
  @ApiOkResponse({ type: ApiResultDto })
  async deleteContact(
    @CurrentUser() user: CachedUser,
    @Param('userId') userId: string,
  ): Promise<ApiResultDto> {
    await this.contactService.deleteContact(user.userId, userId);

    return {
      success: true,
      errorCode: null,
    };
  }
}
