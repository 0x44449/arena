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

export interface PublicUser {
  email: string;
  loginId: string;
  displayName: string;
  avatarUrl: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Message {
  messageId: string;
  vaultId: string;
  zoneId: string;
  content: string;
  createdAt: string;
  sender: PublicUser;
}