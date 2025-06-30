import { ImageChatAttachmentMetadataType } from "@/types/chat-attachment-metadata.type";
import ChatAttachmentDto from "@/types/chat-attachment.dto";
import ChatMessageDto from "@/types/chat-message.dto";

interface ChatAttachmentProps {
  message: ChatMessageDto;
  attachment: ChatAttachmentDto;
}

export default function ChatAttachment(props: ChatAttachmentProps) {
  const { message, attachment } = props;

  switch (attachment.type) {
    case "image":
      const imageMetadata = attachment.metadata as ImageChatAttachmentMetadataType;
      return (
        <div className="flex items-center gap-2">
          <img
            src={attachment.file.url}
            width={imageMetadata.width}
            height={imageMetadata.height}
            className="max-w-full max-h-60 object-contain rounded"
          />
        </div>
      );
    case "video":
      return null;
    case "file":
      return null;
    default:
      return null;
  }
}