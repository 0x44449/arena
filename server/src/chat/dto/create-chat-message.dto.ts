import { Expose } from "class-transformer";

export class CreateChatMessageDto {
  @Expose()
  text: string;

  @Expose()
  attachmentIds?: string[];
}