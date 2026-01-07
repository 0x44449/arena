import type { SQLiteDatabase } from 'expo-sqlite';
import type { ContactDto } from '@/api/generated/models';
import { getDatabase } from '../database';

// 테이블명
const tableName = 'contacts';

// 컬럼 정의
const cols = {
  userId: 'user_id',
  data: 'data',
} as const;

// Row 타입
export type ContactRow = {
  userId: string;
  data: string; // JSON(ContactDto)
};

// 파싱 헬퍼
const parseRow = (row: ContactRow): ContactDto => JSON.parse(row.data);

// DB 가져오기 헬퍼
const resolveDb = async (db?: SQLiteDatabase) => db ?? await getDatabase();

// CRUD
export const contactsTable = {
  tableName,
  cols,

  findAll: async (db?: SQLiteDatabase): Promise<ContactDto[]> => {
    const conn = await resolveDb(db);
    const rows = await conn.getAllAsync<ContactRow>(
      `SELECT * FROM ${tableName}`
    );
    return rows.map(parseRow);
  },

  findByUserId: async (
    params: { userId: string },
    db?: SQLiteDatabase
  ): Promise<ContactDto | null> => {
    const { userId } = params;
    const conn = await resolveDb(db);
    const row = await conn.getFirstAsync<ContactRow>(
      `SELECT * FROM ${tableName} WHERE ${cols.userId} = ?`,
      userId
    );
    return row ? parseRow(row) : null;
  },

  upsert: async (
    params: { contact: ContactDto },
    db?: SQLiteDatabase
  ): Promise<void> => {
    const { contact } = params;
    const conn = await resolveDb(db);
    await conn.runAsync(
      `INSERT INTO ${tableName} (${cols.userId}, ${cols.data})
       VALUES (?, ?)
       ON CONFLICT(${cols.userId}) DO UPDATE SET
         ${cols.data} = excluded.${cols.data}`,
      contact.user.userId,
      JSON.stringify(contact)
    );
  },

  upsertMany: async (
    params: { contacts: ContactDto[] },
    db?: SQLiteDatabase
  ): Promise<void> => {
    const { contacts } = params;
    const conn = await resolveDb(db);
    const run = async () => {
      for (const contact of contacts) {
        await conn.runAsync(
          `INSERT INTO ${tableName} (${cols.userId}, ${cols.data})
           VALUES (?, ?)
           ON CONFLICT(${cols.userId}) DO UPDATE SET
             ${cols.data} = excluded.${cols.data}`,
          contact.user.userId,
          JSON.stringify(contact)
        );
      }
    };

    if (db) {
      await run();
    } else {
      await conn.withTransactionAsync(run);
    }
  },

  delete: async (
    params: { userId: string },
    db?: SQLiteDatabase
  ): Promise<void> => {
    const { userId } = params;
    const conn = await resolveDb(db);
    await conn.runAsync(
      `DELETE FROM ${tableName} WHERE ${cols.userId} = ?`,
      userId
    );
  },

  clear: async (db?: SQLiteDatabase): Promise<void> => {
    const conn = await resolveDb(db);
    await conn.runAsync(`DELETE FROM ${tableName}`);
  },
};
