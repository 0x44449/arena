import type { SQLiteDatabase } from 'expo-sqlite';
import { getDatabase } from '../database';

// 컬럼 정의
const cols = {
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

// DB 가져오기 헬퍼
const resolveDb = async (db?: SQLiteDatabase) => db ?? await getDatabase();

// CRUD
export const syncQueueTable = {
  cols,

  findAll: async (db?: SQLiteDatabase): Promise<SyncQueueRow[]> => {
    const conn = await resolveDb(db);
    return await conn.getAllAsync<SyncQueueRow>(
      `SELECT * FROM sync_queue ORDER BY ${cols.id} ASC`
    );
  },

  add: async <T>(type: SyncQueueType, payload: T, db?: SQLiteDatabase): Promise<number> => {
    const conn = await resolveDb(db);
    const result = await conn.runAsync(
      `INSERT INTO sync_queue (${cols.type}, ${cols.payload}, ${cols.createdAt}, ${cols.retryCount})
       VALUES (?, ?, ?, 0)`,
      type,
      JSON.stringify(payload),
      new Date().toISOString()
    );
    return result.lastInsertRowId;
  },

  incrementRetry: async (id: number, db?: SQLiteDatabase): Promise<void> => {
    const conn = await resolveDb(db);
    await conn.runAsync(
      `UPDATE sync_queue SET ${cols.retryCount} = ${cols.retryCount} + 1 WHERE ${cols.id} = ?`,
      id
    );
  },

  remove: async (id: number, db?: SQLiteDatabase): Promise<void> => {
    const conn = await resolveDb(db);
    await conn.runAsync(
      `DELETE FROM sync_queue WHERE ${cols.id} = ?`,
      id
    );
  },

  clear: async (db?: SQLiteDatabase): Promise<void> => {
    const conn = await resolveDb(db);
    await conn.runAsync(`DELETE FROM sync_queue`);
  },
};
