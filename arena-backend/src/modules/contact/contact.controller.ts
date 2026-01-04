import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from "@nestjs/common";
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiTags } from "@nestjs/swagger";
import { ArenaJwtAuthGuard } from "src/guards/arena-jwt-auth-guard";
import { CurrentUser } from "src/decorators/current-user.decorator";
import { ContactDto } from "src/dtos/contact.dto";
import { ApiResultDto } from "src/dtos/api-result.dto";
import { withSingleApiResult, type SingleApiResultDto } from "src/dtos/single-api-result.dto";
import { withListApiResult, type ListApiResultDto } from "src/dtos/list-api-result.dto";
import { CreateContactDto } from "./dtos/create-contact.dto";
import { ContactService } from "./contact.service";
import { UserService } from "../user/user.service";
import { S3Service } from "../file/s3.service";
import { toContactDto } from "src/utils/contact.mapper";
import { toUserDto } from "src/utils/user.mapper";
import { toFileDto } from "src/utils/file.mapper";
import type { JwtPayload } from "src/types/jwt-payload.interface";

@ApiTags("contacts")
@Controller("/api/v1/contacts")
@UseGuards(ArenaJwtAuthGuard)
@ApiBearerAuth()
export class ContactController {
  constructor(
    private readonly contactService: ContactService,
    private readonly userService: UserService,
    private readonly s3Service: S3Service,
  ) {}

  @Get()
  @ApiOperation({ summary: "내 연락처 목록 조회" })
  @ApiOkResponse({ type: () => withListApiResult(ContactDto) })
  async getContacts(
    @CurrentUser() jwt: JwtPayload,
  ): Promise<ListApiResultDto<ContactDto>> {
    const user = await this.userService.getByUid(jwt.uid);

    const contacts = await this.contactService.getContacts(user.userId);

    const contactDtos: ContactDto[] = [];
    for (const contact of contacts) {
      const avatar = contact.user.avatar
        ? await toFileDto(contact.user.avatar, this.s3Service)
        : null;
      const userDto = toUserDto(contact.user, avatar);
      contactDtos.push(toContactDto(contact, userDto));
    }

    return {
      success: true,
      data: contactDtos,
      errorCode: null,
    };
  }

  @Post()
  @ApiOperation({ summary: "연락처 추가" })
  @ApiOkResponse({ type: () => withSingleApiResult(ContactDto) })
  async createContact(
    @CurrentUser() jwt: JwtPayload,
    @Body() dto: CreateContactDto,
  ): Promise<SingleApiResultDto<ContactDto>> {
    const user = await this.userService.getByUid(jwt.uid);

    const contact = await this.contactService.createContact(user.userId, dto.userId);

    const avatar = contact.user.avatar
      ? await toFileDto(contact.user.avatar, this.s3Service)
      : null;
    const userDto = toUserDto(contact.user, avatar);

    return {
      success: true,
      data: toContactDto(contact, userDto),
      errorCode: null,
    };
  }

  @Delete(":userId")
  @ApiOperation({ summary: "연락처 삭제" })
  @ApiOkResponse({ type: ApiResultDto })
  async deleteContact(
    @CurrentUser() jwt: JwtPayload,
    @Param("userId") userId: string,
  ): Promise<ApiResultDto> {
    const user = await this.userService.getByUid(jwt.uid);

    await this.contactService.deleteContact(user.userId, userId);

    return {
      success: true,
      errorCode: null,
    };
  }
}
