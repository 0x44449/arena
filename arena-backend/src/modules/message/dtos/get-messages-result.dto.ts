import { MessageEntity } from 'src/entities/message.entity';

export interface GetMessagesResultDto {
  messages: MessageEntity[];
  hasNext: boolean;
  hasPrev: boolean;
}
