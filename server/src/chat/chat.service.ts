import { Injectable } from "@nestjs/common";
import { UserService } from "@/user/user.service";
import { ChatMessageDto } from "@/dto/chat-message.dto";
import { PublicUserDto } from "@/dto/public-user.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { ChatMessageEntity } from "@/entity/chat-message.entity";
import { Repository } from "typeorm";
import { ChatMessagePayload } from "./payload/chat-message.payload";

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(ChatMessageEntity)
    private readonly messageRepository: Repository<ChatMessageEntity>,
    private readonly userService: UserService
  ) {}

  async createMessage(payload: ChatMessagePayload, userId: string): Promise<ChatMessageDto> {
    const { featureId, content } = payload;

    const message = await this.messageRepository.save<Partial<ChatMessageEntity>>({
      featureId,
      content,
      senderId: userId,
    });

    // User 매핑
    const user = await this.userService.getUserByUserId(userId);
    const messageDto = new ChatMessageDto(message);
    if (user) {
      messageDto.sender = new PublicUserDto(user);
    }

    return messageDto;
  }

  async getMessages(featureId: string): Promise<ChatMessageDto[]> {
    const messages = await this.messageRepository.find({
      where: { featureId },
      order: { createdAt: "ASC" },
      take: 50,
    });

    // User 매핑
    const messageDtos = await Promise.all(
      messages.map(async (message) => {
        const user = await this.userService.getUserByUserId(message.senderId);
        const messageDto = new ChatMessageDto(message);
        if (user) {
          messageDto.sender = new PublicUserDto(user);
        }
        return messageDto;
      })
    );

    return messageDtos;
  }
}