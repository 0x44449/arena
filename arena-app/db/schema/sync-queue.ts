import type { SQLiteDatabase } from 'expo-sqlite';
import { getDatabase } from '../database';

// 테이블명
const tableName = 'sync_queue';

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
  tableName,
  cols,

  findAll: async (db?: SQLiteDatabase): Promise<SyncQueueRow[]> => {
    const conn = await resolveDb(db);
    return await conn.getAllAsync<SyncQueueRow>(
      `SELECT * FROM ${tableName} ORDER BY ${cols.id} ASC`
    );
  },

  add: async <T>(
    params: { type: SyncQueueType; payload: T },
    db?: SQLiteDatabase
  ): Promise<number> => {
    const { type, payload } = params;
    const conn = await resolveDb(db);
    const result = await conn.runAsync(
      `INSERT INTO ${tableName} (${cols.type}, ${cols.payload}, ${cols.createdAt}, ${cols.retryCount})
       VALUES (?, ?, ?, 0)`,
      type,
      JSON.stringify(payload),
      new Date().toISOString()
    );
    return result.lastInsertRowId;
  },

  incrementRetry: async (
    params: { id: number },
    db?: SQLiteDatabase
  ): Promise<void> => {
    const { id } = params;
    const conn = await resolveDb(db);
    await conn.runAsync(
      `UPDATE ${tableName} SET ${cols.retryCount} = ${cols.retryCount} + 1 WHERE ${cols.id} = ?`,
      id
    );
  },

  remove: async (
    params: { id: number },
    db?: SQLiteDatabase
  ): Promise<void> => {
    const { id } = params;
    const conn = await resolveDb(db);
    await conn.runAsync(
      `DELETE FROM ${tableName} WHERE ${cols.id} = ?`,
      id
    );
  },

  clear: async (db?: SQLiteDatabase): Promise<void> => {
    const conn = await resolveDb(db);
    await conn.runAsync(`DELETE FROM ${tableName}`);
  },
};
