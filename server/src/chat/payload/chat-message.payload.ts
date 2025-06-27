export interface ChatMessagePayload {
  featureId: string;
  content: string;
}

export interface TextChatMessagePayload {
  featureId: string;
  text: string;
}

export interface ImageChatMessagePayload {
  featureId: string;
  text?: string;
}