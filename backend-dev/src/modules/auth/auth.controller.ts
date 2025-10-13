import { Controller, Post } from "@nestjs/common";

@Controller("api/v1/auth")
export class AuthController {
  @Post("token/exchange")
  exchangeToken(): string {
    return "token";
  }

  @Post("token/refresh")
  refreshToken(): string {
    return "token";
  }
}