import ChatAttachmentDto from "./chat-attachment.dto";
import PublicUserDto from "./public-user.dto";

export default interface ChatMessageDto {
  messageId: string;
  featureId: string;
  text: string;
  createdAt: Date;
  updatedAt: Date;
  sender: PublicUserDto;
  attachments: ChatAttachmentDto[];
}