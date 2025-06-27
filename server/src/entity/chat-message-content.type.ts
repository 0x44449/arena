export interface TextChatMessageContent {
  type: 'text';
  text: string;
}

export interface ImageChatMessageContent {
  type: 'image';
  text: string;
  fileId: string;
  width: number;
  height: number;
}

export type ChatMessageContent = TextChatMessageContent | ImageChatMessageContent;