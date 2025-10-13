import { Controller, Delete, Get, Patch, Post } from "@nestjs/common";

@Controller("api/v1/chat")
export class ChatController {
  @Get(":channelId/messages")
  getChats(): string {
    return "List of chats";
  }

  @Post(":channelId/messages")
  createChat(): string {
    return "Chat created";
  }

  @Patch(":channelId/messages/:messageId")
  updateChat(): string {
    return "Chat updated";
  }

  @Delete(":channelId/messages/:messageId")
  deleteChat(): string {
    return "Chat deleted";
  }
}