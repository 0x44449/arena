export interface ImageChatAttachmentMetadataType {
  type: 'image';
  width: number;
  height: number;
}

export interface VideoChatAttachmentMetadataType {
  type: 'video';
  width: number;
  height: number;
  duration: number;
}

export interface FileChatAttachmentMetadataType {
  type: 'file';
}

export type ChatAttachmentMetadataType =
  | ImageChatAttachmentMetadataType
  | VideoChatAttachmentMetadataType
  | FileChatAttachmentMetadataType;