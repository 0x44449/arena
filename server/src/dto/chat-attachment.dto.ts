import { ChatAttachmentMetadataType } from "@/types/chat-attachment-metadata.type";
import { Expose } from "class-transformer";
import { FileDto } from "./file.dto";
import { ChatAttachmentEntity } from "@/entity/chat-attachment.entity";

export class ChatAttachmentDto {
  @Expose()
  fileId: string;

  @Expose()
  featureId: string;

  @Expose()
  messageId: string;

  @Expose()
  type: 'image' | 'video' | 'file';

  @Expose()
  metadata: ChatAttachmentMetadataType;

  @Expose()
  file: FileDto;

  static fromEntity(entity: ChatAttachmentEntity): ChatAttachmentDto {
    const instance = new ChatAttachmentDto();
    Object.assign(instance, entity);
    return instance;
  }
}