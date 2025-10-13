import { Controller, Delete, Get, Patch, Post } from "@nestjs/common";

@Controller("api/v1/channels")
export class ChannelController {
  @Get(":channelId")
  getChannel(): string {
    return "Channel details";
  }

  @Post()
  createChannel(): string {
    return "Channel created";
  }

  @Patch(":channelId")
  updateChannel(): string {
    return "Channel updated";
  }

  @Delete(":channelId")
  deleteChannel(): string {
    return "Channel deleted";
  }
}