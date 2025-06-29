import { ChatAttachmentMetadataType } from "@/types/chat-attachment-metadata.type";
import { FileDto } from "./file.dto";
import { ChatAttachmentEntity } from "@/entity/chat-attachment.entity";

export class ChatAttachmentDto {
  fileId: string;
  featureId: string;
  messageId: string;
  type: 'image' | 'video' | 'file';
  metadata: ChatAttachmentMetadataType;
  file: FileDto;

  static fromEntity(entity: ChatAttachmentEntity): ChatAttachmentDto {
    const instance = new ChatAttachmentDto();
    Object.assign(instance, entity);
    return instance;
  }
}