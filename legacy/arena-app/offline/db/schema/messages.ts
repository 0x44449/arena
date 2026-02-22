import type { MessageDto } from '@/api/generated/models';

// 테이블명
export const tableName = 'messages';

// 컬럼 정의
export const cols = {
  messageId: 'message_id',
  channelId: 'channel_id',
  seq: 'seq',
  syncStatus: 'sync_status',
  tempId: 'temp_id',
  data: 'data',
} as const;

// 동기화 상태
export type SyncStatus = 'pending' | 'synced' | 'failed';

// Row 타입
export type MessageRow = {
  messageId: string;
  channelId: string;
  seq: number;
  syncStatus: SyncStatus;
  tempId: string | null;
  data: string; // JSON(MessageDto)
};

// 확장된 메시지 타입 (로컬 상태 포함)
export type LocalMessage = MessageDto & {
  syncStatus: SyncStatus;
  tempId: string | null;
};

// 메시지 조회 결과 타입
export type FindMessagesResult = {
  messages: LocalMessage[];
  hasNext: boolean;
  hasPrev: boolean;
};

// 파싱 헬퍼
export const parseRow = (row: MessageRow): LocalMessage => ({
  ...JSON.parse(row.data),
  syncStatus: row.syncStatus,
  tempId: row.tempId,
});
