import type { SQLiteDatabase } from 'expo-sqlite';
import type { ChannelDto, ChannelDtoType } from '@/api/generated/models';
import { getDatabase } from '../database';

// 테이블명
const tableName = 'channels';

// 컬럼 정의
const cols = {
  channelId: 'channel_id',
  type: 'type',
  lastMessageAt: 'last_message_at',
  data: 'data',
} as const;

// Row 타입
export type ChannelRow = {
  channelId: string;
  type: ChannelDtoType;
  lastMessageAt: string | null;
  data: string; // JSON(ChannelDto)
};

// 파싱 헬퍼
const parseRow = (row: ChannelRow): ChannelDto => JSON.parse(row.data);

// DB 가져오기 헬퍼
const resolveDb = async (db?: SQLiteDatabase) => db ?? await getDatabase();

// CRUD
export const channelsTable = {
  tableName,
  cols,

  findById: async (
    params: { channelId: string },
    db?: SQLiteDatabase
  ): Promise<ChannelDto | null> => {
    const { channelId } = params;
    const conn = await resolveDb(db);
    const row = await conn.getFirstAsync<ChannelRow>(
      `SELECT * FROM ${tableName} WHERE ${cols.channelId} = ?`,
      channelId
    );
    return row ? parseRow(row) : null;
  },

  findAll: async (db?: SQLiteDatabase): Promise<ChannelDto[]> => {
    const conn = await resolveDb(db);
    const rows = await conn.getAllAsync<ChannelRow>(
      `SELECT * FROM ${tableName} ORDER BY ${cols.lastMessageAt} DESC NULLS LAST`
    );
    return rows.map(parseRow);
  },

  findByType: async (
    params: { type: ChannelDtoType },
    db?: SQLiteDatabase
  ): Promise<ChannelDto[]> => {
    const { type } = params;
    const conn = await resolveDb(db);
    const rows = await conn.getAllAsync<ChannelRow>(
      `SELECT * FROM ${tableName} WHERE ${cols.type} = ? ORDER BY ${cols.lastMessageAt} DESC NULLS LAST`,
      type
    );
    return rows.map(parseRow);
  },

  upsert: async (
    params: { channel: ChannelDto },
    db?: SQLiteDatabase
  ): Promise<void> => {
    const { channel } = params;
    const conn = await resolveDb(db);
    await conn.runAsync(
      `INSERT INTO ${tableName} (${cols.channelId}, ${cols.type}, ${cols.lastMessageAt}, ${cols.data})
       VALUES (?, ?, ?, ?)
       ON CONFLICT(${cols.channelId}) DO UPDATE SET
         ${cols.type} = excluded.${cols.type},
         ${cols.lastMessageAt} = excluded.${cols.lastMessageAt},
         ${cols.data} = excluded.${cols.data}`,
      channel.channelId,
      channel.type,
      channel.lastMessageAt ?? null,
      JSON.stringify(channel)
    );
  },

  upsertMany: async (
    params: { channels: ChannelDto[] },
    db?: SQLiteDatabase
  ): Promise<void> => {
    const { channels } = params;
    const conn = await resolveDb(db);
    const run = async () => {
      for (const channel of channels) {
        await conn.runAsync(
          `INSERT INTO ${tableName} (${cols.channelId}, ${cols.type}, ${cols.lastMessageAt}, ${cols.data})
           VALUES (?, ?, ?, ?)
           ON CONFLICT(${cols.channelId}) DO UPDATE SET
             ${cols.type} = excluded.${cols.type},
             ${cols.lastMessageAt} = excluded.${cols.lastMessageAt},
             ${cols.data} = excluded.${cols.data}`,
          channel.channelId,
          channel.type,
          channel.lastMessageAt ?? null,
          JSON.stringify(channel)
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
    params: { channelId: string },
    db?: SQLiteDatabase
  ): Promise<void> => {
    const { channelId } = params;
    const conn = await resolveDb(db);
    await conn.runAsync(
      `DELETE FROM ${tableName} WHERE ${cols.channelId} = ?`,
      channelId
    );
  },
};
