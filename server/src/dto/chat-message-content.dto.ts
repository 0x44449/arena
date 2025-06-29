import { ImageChatMessageContent, TextChatMessageContent } from "@/entity/chat-message-content.type";
import { FileDto } from "./file.dto";
import { FileEntity } from "@/entity/file.entity";

export class TextChatMessageContentDto {
  type: 'text';
  text: string;

  private constructor() {}

  static fromEntity(entity: Partial<TextChatMessageContent>): TextChatMessageContentDto {
    const instance = new TextChatMessageContentDto();
    Object.assign(instance, entity);
    return instance;
  }
}

export class ImageChatMessageContentDto {
  type: 'image';
  text: string;
  fileId: string;
  width: number;
  height: number;
  file: FileDto;

  private constructor() {}

  static fromEntity(
    messageEntity: ImageChatMessageContent, fileEntity?: FileEntity
  ): ImageChatMessageContentDto {
    const instance = new ImageChatMessageContentDto();
    Object.assign(instance, messageEntity);

    if (fileEntity) {
      instance.file = FileDto.fromEntity(fileEntity);
    }
    return instance;
  }
}

export type ChatMessageContentDto = TextChatMessageContentDto | ImageChatMessageContentDto;