import { ImageChatMessageContent, TextChatMessageContent } from "@/entity/chat-message-content.type";
import { ApiProperty } from "@nestjs/swagger";
import { Expose } from "class-transformer";
import { FileDto } from "./file.dto";
import { FileEntity } from "@/entity/file.entity";

export class TextChatMessageContentDto {
  @ApiProperty()
  @Expose()
  type: 'text';

  @ApiProperty()
  @Expose()
  text: string;

  private constructor() {}

  static fromEntity(entity: Partial<TextChatMessageContent>): TextChatMessageContentDto {
    const instance = new TextChatMessageContentDto();
    Object.assign(instance, entity);
    return instance;
  }
}

export class ImageChatMessageContentDto {
  @ApiProperty()
  @Expose()
  type: 'image';

  @ApiProperty()
  @Expose()
  text: string;

  @ApiProperty()
  @Expose()
  fileId: string;

  @ApiProperty()
  @Expose()
  width: number;

  @ApiProperty()
  @Expose()
  height: number;

  @ApiProperty({ type: FileDto })
  @Expose()
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