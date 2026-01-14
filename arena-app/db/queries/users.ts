import type { SQLiteDatabase } from 'expo-sqlite';
import type { UserDto } from '@/api/generated/models';
import { getDatabase } from '../database';
import { tableName, cols, parseRow, type UserRow } from '../schema/users';

// DB 가져오기 헬퍼
const resolveDb = async (db?: SQLiteDatabase) => db ?? await getDatabase();

export const usersQuery = {
  findById: async (
    params: { userId: string },
    db?: SQLiteDatabase
  ): Promise<UserDto | null> => {
    const { userId } = params;
    const conn = await resolveDb(db);
    const row = await conn.getFirstAsync<UserRow>(
      `SELECT * FROM ${tableName} WHERE ${cols.userId} = ?`,
      userId
    );
    return row ? parseRow(row) : null;
  },

  findByIds: async (
    params: { userIds: string[] },
    db?: SQLiteDatabase
  ): Promise<UserDto[]> => {
    const { userIds } = params;
    if (userIds.length === 0) return [];
    const conn = await resolveDb(db);
    const placeholders = userIds.map(() => '?').join(', ');
    const rows = await conn.getAllAsync<UserRow>(
      `SELECT * FROM ${tableName} WHERE ${cols.userId} IN (${placeholders})`,
      ...userIds
    );
    return rows.map(parseRow);
  },

  upsert: async (
    params: { user: UserDto },
    db?: SQLiteDatabase
  ): Promise<void> => {
    const { user } = params;
    const conn = await resolveDb(db);
    await conn.runAsync(
      `INSERT INTO ${tableName} (${cols.userId}, ${cols.data})
       VALUES (?, ?)
       ON CONFLICT(${cols.userId}) DO UPDATE SET
         ${cols.data} = excluded.${cols.data}`,
      user.userId,
      JSON.stringify(user)
    );
  },

  upsertMany: async (
    params: { users: UserDto[] },
    db?: SQLiteDatabase
  ): Promise<void> => {
    const { users } = params;
    const conn = await resolveDb(db);
    const run = async () => {
      for (const user of users) {
        await conn.runAsync(
          `INSERT INTO ${tableName} (${cols.userId}, ${cols.data})
           VALUES (?, ?)
           ON CONFLICT(${cols.userId}) DO UPDATE SET
             ${cols.data} = excluded.${cols.data}`,
          user.userId,
          JSON.stringify(user)
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
};
