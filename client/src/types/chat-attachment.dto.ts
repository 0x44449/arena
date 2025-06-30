import { ChatAttachmentMetadataType } from "./chat-attachment-metadata.type";
import FileDto from "./file.dto";

export default interface ChatAttachmentDto {
  fileId: string;
  featureId: string;
  messageId: string;
  type: 'image' | 'video' | 'file';
  metadata: ChatAttachmentMetadataType;
  file: FileDto;
}