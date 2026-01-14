import type { SQLiteDatabase } from 'expo-sqlite';
import { getDatabase } from '../database';
import { tableName, cols, type SyncQueueRow, type SyncQueueType } from '../schema/sync-queue';

// DB 가져오기 헬퍼
const resolveDb = async (db?: SQLiteDatabase) => db ?? await getDatabase();

export const syncQueueQuery = {
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
