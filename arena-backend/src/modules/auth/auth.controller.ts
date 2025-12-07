import { Body, Controller, Get, Patch, Post } from "@nestjs/common";
import { ApiResultDto } from "src/dtos/api-result.dto";
import { RegistDto } from "./dtos/regist.dto";
import { UnregistDto } from "./dtos/unregist.dto";

@Controller("api/v1/auth")
export class AuthController {
  constructor() { }

  @Post("regist")
  async regist(@Body() registDto: RegistDto): Promise<ApiResultDto> {
    const body = registDto;
    console.log("Regist called with:", body);

    return {
      success: true,
      errorCode: null,
    };
  }

  @Post("unregist")
  async unregist(@Body() registDto: UnregistDto): Promise<ApiResultDto> {
    const body = registDto;
    console.log("Unregist called with:", body);
    
    return {
      success: true,
      errorCode: null,
    };
  }

  @Get("status")
  async status(): Promise<ApiResultDto> {
    console.log("Status called");

    return {
      success: true,
      errorCode: null,
    };
  }
}