export class ChatMessageDto {
  id: string;
  vaultId: string;
  zoneId: string;
  senderId: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;

  constructor(input: Partial<ChatMessageDto>) {
    Object.assign(this, input);
  }
}