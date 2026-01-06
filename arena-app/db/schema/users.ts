import type { SQLiteDatabase } from 'expo-sqlite';
import type { UserDto } from '@/api/generated/models';
import { getDatabase } from '../database';

// 컬럼 정의
const cols = {
  userId: 'user_id',
  data: 'data',
} as const;

// Row 타입
export type UserRow = {
  userId: string;
  data: string; // JSON(UserDto)
};

// 파싱 헬퍼
const parseRow = (row: UserRow): UserDto => JSON.parse(row.data);

// DB 가져오기 헬퍼
const resolveDb = async (db?: SQLiteDatabase) => db ?? await getDatabase();

// CRUD
export const usersTable = {
  cols,

  findById: async (userId: string, db?: SQLiteDatabase): Promise<UserDto | null> => {
    const conn = await resolveDb(db);
    const row = await conn.getFirstAsync<UserRow>(
      `SELECT * FROM users WHERE ${cols.userId} = ?`,
      userId
    );
    return row ? parseRow(row) : null;
  },

  findByIds: async (userIds: string[], db?: SQLiteDatabase): Promise<UserDto[]> => {
    if (userIds.length === 0) return [];
    const conn = await resolveDb(db);
    const placeholders = userIds.map(() => '?').join(', ');
    const rows = await conn.getAllAsync<UserRow>(
      `SELECT * FROM users WHERE ${cols.userId} IN (${placeholders})`,
      ...userIds
    );
    return rows.map(parseRow);
  },

  upsert: async (user: UserDto, db?: SQLiteDatabase): Promise<void> => {
    const conn = await resolveDb(db);
    await conn.runAsync(
      `INSERT INTO users (${cols.userId}, ${cols.data})
       VALUES (?, ?)
       ON CONFLICT(${cols.userId}) DO UPDATE SET
         ${cols.data} = excluded.${cols.data}`,
      user.userId,
      JSON.stringify(user)
    );
  },

  upsertMany: async (users: UserDto[], db?: SQLiteDatabase): Promise<void> => {
    const conn = await resolveDb(db);
    const run = async () => {
      for (const user of users) {
        await conn.runAsync(
          `INSERT INTO users (${cols.userId}, ${cols.data})
           VALUES (?, ?)
           ON CONFLICT(${cols.userId}) DO UPDATE SET
             ${cols.data} = excluded.${cols.data}`,
          user.userId,
          JSON.stringify(user)
        );
      }
    };
    
    // 외부에서 db를 넘겼으면 이미 트랜잭션 안에 있을 수 있으니 그냥 실행
    // 아니면 자체 트랜잭션으로 묶기
    if (db) {
      await run();
    } else {
      await conn.withTransactionAsync(run);
    }
  },

  delete: async (userId: string, db?: SQLiteDatabase): Promise<void> => {
    const conn = await resolveDb(db);
    await conn.runAsync(
      `DELETE FROM users WHERE ${cols.userId} = ?`,
      userId
    );
  },
};
