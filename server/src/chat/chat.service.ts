import { Injectable } from "@nestjs/common";
import { UserService } from "@/user/user.service";
import { ChatMessageDto } from "@/dto/chat-message.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { ChatMessageEntity } from "@/entity/chat-message.entity";
import { Repository } from "typeorm";
import { WellKnownError } from "@/common/exception-manage/well-known-error";
import { ConfigService } from "@nestjs/config";
import { join } from "path";
import sharp from "sharp";
import { FileEntity } from "@/entity/file.entity";
import { ChatGateway } from "./chat.gateway";
import { CreateChatMessageDto } from "./dto/create-chat-message.dto";
import { ChatAttachmentEntity } from "@/entity/chat-attachment.entity";
import { ChatAttachmentDto } from "@/dto/chat-attachment.dto";
import { FileDto } from "@/dto/file.dto";
import { nanoid } from "nanoid";
import { ChatAttachmentMetadataType, FileChatAttachmentMetadataType, ImageChatAttachmentMetadataType, VideoChatAttachmentMetadataType } from "@/types/chat-attachment-metadata.type";

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(ChatMessageEntity)
    private readonly messageRepository: Repository<ChatMessageEntity>,
    @InjectRepository(FileEntity)
    private readonly fileRepository: Repository<FileEntity>,
    @InjectRepository(ChatAttachmentEntity)
    private readonly attachmentRepository: Repository<ChatAttachmentEntity>,
    private readonly userService: UserService,
    private readonly configService: ConfigService,
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

  async createMessage(featureId: string, param: CreateChatMessageDto, userId: string): Promise<ChatMessageDto> {
    // 첨부파일이 있을땐 메세지가 비워져 있을 수 있음
    if (!param.text && !param.attachmentIds) {
      throw new WellKnownError({
        message: "Message text or attachments must be provided",
        errorCode: "MESSAGE_CONTENT_REQUIRED",
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

    // 첨부파일 검증
    const entitySet: { attachmentEntity: ChatAttachmentEntity, fileEntity: FileEntity, }[] = [];
    if (param.attachmentIds) {
      for (const attachmentId of param.attachmentIds) {
        const attachment = await this.attachmentRepository.findOne({
          where: { fileId: attachmentId, featureId: featureId },
        });

        // 첨부파일이 존재하지 않음 - 오류
        if (!attachment) {
          throw new WellKnownError({
            message: `Attachment with ID ${attachmentId} not found`,
            errorCode: "ATTACHMENT_NOT_FOUND",
          });
        }

        // 첨부파일이 이미 메세지에 연결되어있음 - 오류
        if (attachment.messageId) {
          throw new WellKnownError({
            message: `Attachment with ID ${attachmentId} is already associated with a message`,
            errorCode: "ATTACHMENT_ALREADY_ASSOCIATED",
          });
        }

        const file = await this.fileRepository.findOne({
          where: { fileId: attachment.fileId },
        });

        // 파일이 존재하지 않음 - 오류
        if (!file) {
          throw new WellKnownError({
            message: `File with ID ${attachment.fileId} not found`,
            errorCode: "FILE_NOT_FOUND",
          });
        }

        entitySet.push({
          attachmentEntity: attachment,
          fileEntity: file,
        });
      }
    }

    // 채팅 메시지 생성
    const messageEntity = this.messageRepository.create({
      featureId: featureId,
      senderId: userId,
      text: param.text || '',
    });
    const savedMessage = await this.messageRepository.save(messageEntity);

    // 첨부파일 연결
    const attachmentDtoList: ChatAttachmentDto[] = [];
    for (const { attachmentEntity, fileEntity } of entitySet) {
      attachmentEntity.messageId = savedMessage.messageId;
      const savedAttachment = await this.attachmentRepository.save(attachmentEntity);

      const attachmentDto = ChatAttachmentDto.fromEntity(savedAttachment);
      attachmentDto.file = FileDto.fromEntity(fileEntity);

      attachmentDtoList.push(attachmentDto);
    }

    // 메시지 DTO 변환
    const messageDto = ChatMessageDto.fromEntity(savedMessage);
    messageDto.sender = user;
    messageDto.attachments = attachmentDtoList;

    // 메세지 전송 알림
    this.chatGateway.notifyChatMessage(featureId, messageDto);

    return messageDto;
  }

  async uploadAttachments(featureId: string, files: Express.Multer.File[], userId: string): Promise<ChatAttachmentDto[]> {
    if (!files || files.length === 0) {
      throw new WellKnownError({
        message: "No files uploaded",
        errorCode: "NO_FILES_UPLOADED",
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

    const result: ChatAttachmentDto[] = [];
    const isImage = (file: Express.Multer.File) => file.mimetype.startsWith('image/');
    const isVideo = (file: Express.Multer.File) => file.mimetype.startsWith('video/');

    for (const file of files) {
      const fileType = isImage(file) ? 'image' : isVideo(file) ? 'video' : 'file';

      let metadata: ChatAttachmentMetadataType | undefined = undefined;
      const fileFullPath = join(file.destination, file.filename);

      switch (fileType) {
        // 이미지에서 메타데이터 추출
        case 'image':
          const header = await sharp(fileFullPath, { sequentialRead: true }).metadata();
          if (!header.width || !header.height) {
            throw new WellKnownError({
              message: "Invalid image file format",
              errorCode: "INVALID_IMAGE_FORMAT",
            });
          }

          metadata = {
            type: 'image',
            width: header.width,
            height: header.height,
          } satisfies ImageChatAttachmentMetadataType;
          break;
        // 비디오에서 메타데이터 추출
        case 'video':
          metadata = {
            type: 'video',
            duration: 10000, // 비디오의 경우, 실제 메타데이터에서 추출할 수 있음
            height: 100, // 비디오의 경우, 실제 메타데이터에서 추출할 수 있음
            width: 100, // 비디오의 경우, 실제 메타데이터에서 추출할 수 있음
          } satisfies VideoChatAttachmentMetadataType;
          break;
        // 일반 파일에서 메타데이터 추출
        case 'file':
          metadata = {
            type: 'file',
          } satisfies FileChatAttachmentMetadataType;
          break;
        default:
          throw new WellKnownError({
            message: `Unsupported file type: ${fileType}`,
            errorCode: "UNSUPPORTED_FILE_TYPE",
          });
      };

      // 파일 DB 기록
      const fileEntity = this.fileRepository.create({
        fileId: nanoid(12),
        originalName: file.originalname,
        storedName: file.filename,
        mimeType: file.mimetype,
        size: file.size,
        path: file.destination,
        uploaderId: userId,
        category: 'chat-attachment',
      });
      const savedFile = await this.fileRepository.save(fileEntity);
      if (!savedFile) {
        throw new WellKnownError({
          message: "Failed to save uploaded file",
          errorCode: "FILE_SAVE_FAILED",
        });
      }

      // 첨부파일 DB 기록
      const attachmentEntity = this.attachmentRepository.create({
        featureId: featureId,
        fileId: savedFile.fileId,
        type: fileType,
        metadata: metadata,
      });
      const savedAttachment = await this.attachmentRepository.save(attachmentEntity);
      if (!savedAttachment) {
        throw new WellKnownError({
          message: "Failed to save attachment",
          errorCode: "ATTACHMENT_SAVE_FAILED",
        });
      }

      // 첨부파일 DTO 변환
      const attachmentDto = ChatAttachmentDto.fromEntity(savedAttachment);
      attachmentDto.file = FileDto.fromEntity(savedFile);

      result.push(attachmentDto);
    }

    return result;
  }

  // async createTextMessage(featureId: string, param: CreateTextChatMessageDto, userId: string): Promise<ChatMessageDto> {
  //   // 사용자 정보 획득
  //   const user = await this.userService.getUserDtoByUserId(userId);
  //   if (!user) {
  //     throw new WellKnownError({
  //       message: "User not found",
  //       errorCode: "USER_NOT_FOUND",
  //     });
  //   }

  //   // 채팅 메시지 생성
  //   const textContent: TextChatMessageContent = {
  //     type: "text",
  //     text: param.text,
  //   }
  //   const message = this.messageRepository.create({
  //     featureId: featureId,
  //     senderId: userId,
  //     content: textContent,
  //     contentType: "text",
  //   });
  //   const savedMessage = await this.messageRepository.save(message);

  //   const messageDto = ChatMessageDto.fromEntity(savedMessage);
  //   messageDto.sender = user;

  //   // 메세지 전송 알림
  //   this.chatGateway.notifyChatMessage(featureId, messageDto);

  //   return messageDto;
  // }

  // async createImageMessage(featureId: string, param: CreateImageChatMessageDto, file: Express.Multer.File, userId: string): Promise<ChatMessageDto> {
  //   if (!file) {
  //     throw new WellKnownError({
  //       message: "Upload file not found",
  //       errorCode: "UPLOAD_FILE_NOT_FOUND",
  //     });
  //   }

  //   // 사용자 정보 획득
  //   const user = await this.userService.getUserDtoByUserId(userId);
  //   if (!user) {
  //     throw new WellKnownError({
  //       message: "User not found",
  //       errorCode: "USER_NOT_FOUND",
  //     });
  //   }

  //   // 이미지 메타 데이터 추출
  //   const metadata = await sharp(file.buffer).metadata();
  //   const width = metadata.width || 0;
  //   const height = metadata.height || 0;
  //   const size = file.size;
  //   const mimeType = file.mimetype;

  //   if (width === 0 || height === 0) {
  //     throw new WellKnownError({
  //       message: "Invalid image file format",
  //       errorCode: "INVALID_IMAGE_FORMAT",
  //     });
  //   }

  //   // 파일 저장
  //   const fileName = randomUUID();
  //   const destinationDir = this.configService.get<string>('FILE_STORAGE_LOCATION')!;
  //   const fileFullPath = join(destinationDir, fileName);

  //   await fs.promises.mkdir(destinationDir, { recursive: true });
  //   fs.writeFileSync(fileFullPath, file.buffer);

  //   // 파일 정보 기록
  //   const fileEntity = this.fileRepository.create({
  //     fileId: randomUUID(),
  //     originalName: file.originalname,
  //     storedName: fileName,
  //     mimeType: mimeType,
  //     size: size,
  //     path: destinationDir,
  //     uploaderId: userId,
  //     category: 'chat-image',
  //   });
  //   const savedFile = await this.fileRepository.save(fileEntity);

  //   // 채팅 메시지 생성
  //   if (!savedFile) {
  //     throw new WellKnownError({
  //       message: "Failed to save image file",
  //       errorCode: "IMAGE_FILE_SAVE_FAILED",
  //     });
  //   }

  //   const imageContent: ImageChatMessageContent = {
  //     fileId: savedFile.fileId,
  //     type: 'image',
  //     text: param.text || '',
  //     height: height,
  //     width: width,
  //   }
  //   const messageEntity = this.messageRepository.create({
  //     featureId: featureId,
  //     senderId: userId,
  //     content: imageContent,
  //     contentType: "image",
  //   });
  //   const savedMessage = await this.messageRepository.save(messageEntity);

  //   // 메시지 DTO 변환
  //   const messageDto = ChatMessageDto.fromEntity(savedMessage);
  //   messageDto.sender = user;

  //   // 메세지 전송 알림
  //   this.chatGateway.notifyChatMessage(featureId, messageDto);

  //   return messageDto;
  // }
}