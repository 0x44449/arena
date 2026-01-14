import { openDatabaseAsync, type SQLiteDatabase } from 'expo-sqlite';
import { runMigrations } from './migrations';

let db: SQLiteDatabase | null = null;
let initPromise: Promise<SQLiteDatabase> | null = null;

export const getDatabase = async (): Promise<SQLiteDatabase> => {
  if (db) return db;

  // 동시 호출 시 같은 Promise 반환 (race condition 방지)
  if (initPromise) return initPromise;

  initPromise = (async () => {
    const database = await openDatabaseAsync('arena.db');

    // 외래키 활성화
    await database.execAsync('PRAGMA foreign_keys = ON;');

    // 마이그레이션 실행
    await runMigrations(database);

    console.log('[DB] Database initialized');
    db = database;
    return database;
  })();

  return initPromise;
};

export const closeDatabase = async (): Promise<void> => {
  if (db) {
    await db.closeAsync();
    db = null;
    initPromise = null;
    console.log('[DB] Database closed');
  }
};

// 테스트/디버깅용: DB 초기화
export const resetDatabase = async (): Promise<void> => {
  if (db) {
    await db.closeAsync();
    db = null;
    initPromise = null;
  }

  const freshDb = await openDatabaseAsync('arena.db');
  await freshDb.execAsync(`
    PRAGMA writable_schema = 1;
    DELETE FROM sqlite_master;
    PRAGMA writable_schema = 0;
    VACUUM;
  `);
  await freshDb.closeAsync();
  console.log('[DB] Database reset');
};
