import { Body, Controller, Get, HttpCode, Patch, Post } from "@nestjs/common";
import { ApiResultDto } from "src/dtos/api-result.dto";
import { RegistDto } from "./dtos/regist.dto";
import { UnregistDto } from "./dtos/unregist.dto";
import { ApiBadRequestResponse } from "@nestjs/swagger";
import { ApiErrorDto } from "src/dtos/api-error.dto";

@Controller("api/v1/auth")
export class AuthController {
  constructor() { }

  @Post("regist")
  async regist(@Body() registDto: RegistDto): Promise<ApiResultDto> {
    return {
      success: true,
      errorCode: null,
    }
  }

  @Post("unregist")
  async unregist(@Body() registDto: UnregistDto): Promise<ApiResultDto> {
    return {
      success: true,
      errorCode: null,
    }
  }
}