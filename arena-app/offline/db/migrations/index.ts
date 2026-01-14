import type { SQLiteDatabase } from 'expo-sqlite';
import m001 from './001_init';

type Migration = {
  version: number;
  up: string;
};

const migrations: Migration[] = [m001];

export const runMigrations = async (db: SQLiteDatabase): Promise<void> => {
  // 마이그레이션 버전 테이블 생성
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS _migrations (
      version INTEGER PRIMARY KEY
    );
  `);

  // 현재 버전 확인
  const result = await db.getFirstAsync<{ version: number | null }>(
    'SELECT MAX(version) as version FROM _migrations'
  );
  const currentVersion = result?.version ?? 0;

  // 마이그레이션 실행
  for (const migration of migrations) {
    if (migration.version > currentVersion) {
      console.log(`[DB] Running migration ${migration.version}...`);
      await db.execAsync(migration.up);
      await db.runAsync('INSERT INTO _migrations (version) VALUES (?)', migration.version);
      console.log(`[DB] Migration ${migration.version} applied`);
    }
  }
};
