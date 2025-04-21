import { Injectable } from "@nestjs/common";
import { PrismaClient } from "@prisma/client";
import { ChatMessageDto } from "./dto/chat-message.dto";
import { PublicUserDto } from "@/user/dto/public-user.dto";

@Injectable()
export class ChatService {
  constructor(private readonly prisma: PrismaClient) {}

  async getMessages(vaultId: string, zoneId: string): Promise<ChatMessageDto[]> {
    const messages = await this.prisma.message.findMany({
      where: {
        vaultId: vaultId,
        zoneId: zoneId,
      },
      orderBy: {
        createdAt: "asc",
      },
      take: 50,
    });

    // User 매핑
    const result = await Promise.all(
      messages.map(async (message) => {
        const user = await this.prisma.user.findUnique({
          where: {
            userId: message.senderId,
          },
        });

        const messageDto = new ChatMessageDto(message);
        if (user) {
          messageDto.sender = new PublicUserDto(user);
        }
        return messageDto;
      })
    );
    return result;
  }
}