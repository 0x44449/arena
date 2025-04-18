import { Controller, Get, Param } from "@nestjs/common";
import { PrismaClient } from "@prisma/client";

@Controller('chat')
export class ChatController {
  constructor(private readonly prisma: PrismaClient) {}

  @Get('messages/:vaultId/:zoneId')
  async getMessages(@Param('vaultId') vaultId: string, @Param('zoneId') zoneId: string) {
    return await this.prisma.message.findMany({
      where: {
        vaultId: vaultId,
        zoneId: zoneId,
      },
      orderBy: {
        createdAt: 'asc',
      },
      take: 50,
    });
  }
}