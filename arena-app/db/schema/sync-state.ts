import type { SQLiteDatabase } from 'expo-sqlite';
import { getDatabase } from '../database';

// 컬럼 정의
const cols = {
  key: 'key',
  lastSyncedAt: 'last_synced_at',
} as const;

// Row 타입
export type SyncStateRow = {
  key: string;
  lastSyncedAt: string;
};

// DB 가져오기 헬퍼
const resolveDb = async (db?: SQLiteDatabase) => db ?? await getDatabase();

// CRUD
export const syncStateTable = {
  cols,

  get: async (key: string, db?: SQLiteDatabase): Promise<string | null> => {
    const conn = await resolveDb(db);
    const row = await conn.getFirstAsync<SyncStateRow>(
      `SELECT * FROM sync_state WHERE ${cols.key} = ?`,
      key
    );
    return row?.lastSyncedAt ?? null;
  },

  set: async (key: string, lastSyncedAt: string, db?: SQLiteDatabase): Promise<void> => {
    const conn = await resolveDb(db);
    await conn.runAsync(
      `INSERT INTO sync_state (${cols.key}, ${cols.lastSyncedAt})
       VALUES (?, ?)
       ON CONFLICT(${cols.key}) DO UPDATE SET
         ${cols.lastSyncedAt} = excluded.${cols.lastSyncedAt}`,
      key,
      lastSyncedAt
    );
  },

  delete: async (key: string, db?: SQLiteDatabase): Promise<void> => {
    const conn = await resolveDb(db);
    await conn.runAsync(
      `DELETE FROM sync_state WHERE ${cols.key} = ?`,
      key
    );
  },

  clear: async (db?: SQLiteDatabase): Promise<void> => {
    const conn = await resolveDb(db);
    await conn.runAsync(`DELETE FROM sync_state`);
  },
};
