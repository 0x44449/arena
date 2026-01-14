import type { ChannelDto, ChannelDtoType } from '@/api/generated/models';

// 테이블명
export const tableName = 'channels';

// 컬럼 정의
export const cols = {
  channelId: 'channel_id',
  type: 'type',
  lastMessageAt: 'last_message_at',
  data: 'data',
} as const;

// Row 타입
export type ChannelRow = {
  channelId: string;
  type: ChannelDtoType;
  lastMessageAt: string | null;
  data: string; // JSON(ChannelDto)
};

// 파싱 헬퍼
export const parseRow = (row: ChannelRow): ChannelDto => JSON.parse(row.data);
