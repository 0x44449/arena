import PublicUserDto from "./public-user.dto";

export default interface ChatMessageDto {
  messageId: string;
  vaultId: string;
  zoneId: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  sender: PublicUserDto;
}