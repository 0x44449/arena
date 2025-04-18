export interface Vault {
  vaultId: string;
  name: string;
}

export interface Zone {
  zoneId: string;
  name: string;
  hasChat: boolean;
  hasGame: boolean;
  vaultId: string;
}

export interface Message {
  messageId: string;
  vaultId: string;
  zoneId: string;
  userId: string;
  content: string;
  createdAt: string;
}