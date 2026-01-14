// 테이블명
export const tableName = 'sync_queue';

// 컬럼 정의
export const cols = {
  id: 'id',
  type: 'type',
  payload: 'payload',
  createdAt: 'created_at',
  retryCount: 'retry_count',
} as const;

// 작업 타입
export type SyncQueueType = 'sendMessage' | 'createChannel' | 'addContact' | 'deleteContact';

// Row 타입
export type SyncQueueRow = {
  id: number;
  type: SyncQueueType;
  payload: string; // JSON
  createdAt: string;
  retryCount: number;
};
