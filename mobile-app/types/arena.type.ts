export interface ApiResultDto {
  success: boolean;
  errorCode?: string;
}

export interface SingleApiResultDto<T> extends ApiResultDto {
  data: T;
}

export interface PagedApiResultDto<T> extends ApiResultDto {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
}

export interface InifiniteApiResultDto<T> extends ApiResultDto {
  data: T[];
  hasNext: boolean;
  hasPrev: boolean;
}

export interface UserDto {
  userId: string;
  email: string;
  displayName: string;
  message: string;
  createdAt: string;
  updatedAt: string;
  avatarUrl: string;
}

export interface TeamDto {
  teamId: string;
  name: string;
  description: string;
  owner: UserDto;
  createdAt: string;
  updatedAt: string;
}

export interface ChannelDto {
  channelId: string;
  name: string;
  description: string;
  teamId: string;
  owner: UserDto;
  createdAt: string;
  updatedAt: string;
}

export interface ChannelBannerDto {
  channelId: string;
  name: string;
  description: string;
  teamId: string;
  createdAt: string;
  updatedAt: string;
  bannerImageUrl?: string;
  unreadCount: number;
  lastMessage?: ChatMessageDto;
  participants: UserDto[];
}

export interface ChatMessageDto {
  messageId: string;
  seq: number;
  channelId: string;
  message: string;
  sender: UserDto;
  createdAt: string;
  updatedAt: string;
}

export interface FileDto {
  fileId: string;
  mimeType: string;
  size: number;
  createdAt: string;
  uploader: UserDto;
  name: string;
  url: string;
}