import { Injectable } from "@nestjs/common";
import { UserService } from "@/user/user.service";
import { ChatMessageDto } from "@/dto/chat-message.dto";
import { PublicUserDto } from "@/dto/public-user.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { ChatMessageEntity } from "@/entity/chat-message.entity";
import { Repository } from "typeorm";
import { ChatMessagePayload } from "./payload/chat-message.payload";
import { CreateTextChatMessageDto } from "./dto/create-text-chat-message.dto";
import { WellKnownError } from "@/common/exception-manage/well-known-error";
import { ImageChatMessageContent, TextChatMessageContent } from "@/entity/chat-message-content.type";
import { CreateImageChatMessageDto } from "./dto/create-image-chat-message.dto";
import { randomUUID } from "crypto";
import { ConfigService } from "@nestjs/config";
import { join } from "path";
import * as fs from 'fs';
import sharp from "sharp";
import { FileEntity } from "@/entity/file.entity";
import { ChatGateway } from "./chat.gateway";

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(ChatMessageEntity)
    private readonly messageRepository: Repository<ChatMessageEntity>,
    private readonly userService: UserService,
    private readonly configService: ConfigService,
    private readonly fileRepository: Repository<FileEntity>,
    private readonly chatGateway: ChatGateway,
  ) {}

  async getMessages(featureId: string): Promise<ChatMessageDto[]> {
    const messages = await this.messageRepository.find({
      where: { featureId },
      order: { createdAt: "ASC" },
      take: 50,
    });

    // User 매핑
    const messageDtoList = await Promise.all(
      messages.map(async (message) => {
        const user = await this.userService.getUserDtoByUserId(message.senderId);
        const messageDto = ChatMessageDto.fromEntity(message);
        if (user) {
          messageDto.sender = user;
        }
        return messageDto;
      })
    );

    return messageDtoList;
  }

  async createTextMessage(featureId: string, param: CreateTextChatMessageDto, userId: string): Promise<ChatMessageDto> {
    // 사용자 정보 획득
    const user = await this.userService.getUserDtoByUserId(userId);
    if (!user) {
      throw new WellKnownError({
        message: "User not found",
        errorCode: "USER_NOT_FOUND",
      });
    }

    // 채팅 메시지 생성
    const textContent: TextChatMessageContent = {
      type: "text",
      text: param.text,
    }
    const message = this.messageRepository.create({
      featureId: featureId,
      senderId: userId,
      content: textContent,
      contentType: "text",
    });
    const savedMessage = await this.messageRepository.save(message);

    const messageDto = ChatMessageDto.fromEntity(savedMessage);
    messageDto.sender = user;

    // 메세지 전송 알림
    this.chatGateway.notifyChatMessage(featureId, messageDto);

    return messageDto;
  }

  async createImageMessage(featureId: string, param: CreateImageChatMessageDto, file: Express.Multer.File, userId: string): Promise<ChatMessageDto> {
    if (!file) {
      throw new WellKnownError({
        message: "Upload file not found",
        errorCode: "UPLOAD_FILE_NOT_FOUND",
      });
    }

    // 사용자 정보 획득
    const user = await this.userService.getUserDtoByUserId(userId);
    if (!user) {
      throw new WellKnownError({
        message: "User not found",
        errorCode: "USER_NOT_FOUND",
      });
    }

    // 이미지 메타 데이터 추출
    const metadata = await sharp(file.buffer).metadata();
    const width = metadata.width || 0;
    const height = metadata.height || 0;
    const size = file.size;
    const mimeType = file.mimetype;

    if (width === 0 || height === 0) {
      throw new WellKnownError({
        message: "Invalid image file format",
        errorCode: "INVALID_IMAGE_FORMAT",
      });
    }

    // 파일 저장
    const fileName = randomUUID();
    const destinationDir = this.configService.get<string>('FILE_STORAGE_LOCATION')!;
    const fileFullPath = join(destinationDir, fileName);

    await fs.promises.mkdir(destinationDir, { recursive: true });
    fs.writeFileSync(fileFullPath, file.buffer);

    // 파일 정보 기록
    const fileEntity = this.fileRepository.create({
      fileId: randomUUID(),
      originalName: file.originalname,
      storedName: fileName,
      mimeType: mimeType,
      size: size,
      path: destinationDir,
      uploaderId: userId,
      category: 'chat-image',
    });
    const savedFile = await this.fileRepository.save(fileEntity);

    // 채팅 메시지 생성
    if (!savedFile) {
      throw new WellKnownError({
        message: "Failed to save image file",
        errorCode: "IMAGE_FILE_SAVE_FAILED",
      });
    }

    const imageContent: ImageChatMessageContent = {
      fileId: savedFile.fileId,
      type: 'image',
      text: param.text || '',
      height: height,
      width: width,
    }
    const messageEntity = this.messageRepository.create({
      featureId: featureId,
      senderId: userId,
      content: imageContent,
      contentType: "image",
    });
    const savedMessage = await this.messageRepository.save(messageEntity);

    // 메시지 DTO 변환
    const messageDto = ChatMessageDto.fromEntity(savedMessage);
    messageDto.sender = user;

    // 메세지 전송 알림
    this.chatGateway.notifyChatMessage(featureId, messageDto);

    return messageDto;
  }
}