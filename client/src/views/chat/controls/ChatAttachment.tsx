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

      // 가로, 세로중에 더 긴 쪽을 기준으로 크기를 맞추기
      // 300px 기준으로 맞추기
      const maxSize = 300;
      const width = imageMetadata.width || 300;
      const height = imageMetadata.height || 300;
      const aspectRatio = width / height;
      const adjustedWidth = aspectRatio > 1 ? maxSize : maxSize * aspectRatio;
      const adjustedHeight = aspectRatio > 1 ? maxSize / aspectRatio : maxSize;

      return (
        <div
          className="flex item-center justify-center bg-gray-200 rounded-md"
          style={{ height: adjustedHeight, width: adjustedWidth }}
        >
          <img
            src={attachment.file.url}
            className="object-contain rounded-md"
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