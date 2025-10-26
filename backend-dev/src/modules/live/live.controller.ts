import { Controller, Post, Req } from "@nestjs/common";
import type { RawBodyRequest } from "@nestjs/common";
import { LiveService } from "./live.service";
import { Request } from "express";

@Controller("api/v1/live")
export class LiveController {
  constructor(
    private readonly liveService: LiveService,
  ) {}

  @Post("webhook")
  handleLiveWebhook(@Req() req: RawBodyRequest<Request>) {
    const body = req.body?.toString() ?? "";
    const signature = req.headers["authorization"] as string || "";

    return this.liveService.handleLiveWebhook(body, signature);
  }
}