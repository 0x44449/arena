// 테이블명
export const tableName = 'sync_state';

// 컬럼 정의
export const cols = {
  key: 'key',
  lastSyncedAt: 'last_synced_at',
} as const;

// Row 타입
export type SyncStateRow = {
  key: string;
  lastSyncedAt: string;
};
