import { Injectable } from "@nestjs/common";
import { PrismaClient, User } from "@prisma/client";

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaClient) {}

  async getUser(userId: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { userId },
    });
    return user;
  }
}
