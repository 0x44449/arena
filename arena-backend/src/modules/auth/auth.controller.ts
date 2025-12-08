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
  @HttpCode(204)
  @ApiBadRequestResponse({ type: ApiErrorDto })
  async regist(@Body() registDto: RegistDto): Promise<void> {
    const body = registDto;
    console.log("Regist called with:", body);
  }

  @Post("unregist")
  @HttpCode(204)
  async unregist(@Body() registDto: UnregistDto): Promise<void> {
    const body = registDto;
    console.log("Unregist called with:", body);
  }
}