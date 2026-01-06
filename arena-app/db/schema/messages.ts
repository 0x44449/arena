import type { SQLiteDatabase } from 'expo-sqlite';
import type { MessageDto } from '@/api/generated/models';
import { getDatabase } from '../database';

// 컬럼 정의
const cols = {
  messageId: 'message_id',
  channelId: 'channel_id',
  seq: 'seq',
  syncStatus: 'sync_status',
  tempId: 'temp_id',
  data: 'data',
} as const;

// 동기화 상태
export type SyncStatus = 'pending' | 'synced' | 'failed';

// Row 타입
export type MessageRow = {
  messageId: string;
  channelId: string;
  seq: number;
  syncStatus: SyncStatus;
  tempId: string | null;
  data: string; // JSON(MessageDto)
};

// 확장된 메시지 타입 (로컬 상태 포함)
export type LocalMessage = MessageDto & {
  syncStatus: SyncStatus;
  tempId: string | null;
};

// 파싱 헬퍼
const parseRow = (row: MessageRow): LocalMessage => ({
  ...JSON.parse(row.data),
  syncStatus: row.syncStatus,
  tempId: row.tempId,
});

// DB 가져오기 헬퍼
const resolveDb = async (db?: SQLiteDatabase) => db ?? await getDatabase();

// CRUD
export const messagesTable = {
  cols,

  findById: async (messageId: string, db?: SQLiteDatabase): Promise<LocalMessage | null> => {
    const conn = await resolveDb(db);
    const row = await conn.getFirstAsync<MessageRow>(
      `SELECT * FROM messages WHERE ${cols.messageId} = ?`,
      messageId
    );
    return row ? parseRow(row) : null;
  },

  findByIds: async (messageIds: string[], db?: SQLiteDatabase): Promise<LocalMessage[]> => {
    if (messageIds.length === 0) return [];
    const conn = await resolveDb(db);
    const placeholders = messageIds.map(() => '?').join(', ');
    const rows = await conn.getAllAsync<MessageRow>(
      `SELECT * FROM messages WHERE ${cols.messageId} IN (${placeholders})`,
      ...messageIds
    );
    return rows.map(parseRow);
  },

  findByChannel: async (
    channelId: string,
    options?: { limit?: number; beforeSeq?: number },
    db?: SQLiteDatabase
  ): Promise<LocalMessage[]> => {
    const conn = await resolveDb(db);
    const { limit = 50, beforeSeq } = options ?? {};

    if (beforeSeq !== undefined) {
      const rows = await conn.getAllAsync<MessageRow>(
        `SELECT * FROM messages 
         WHERE ${cols.channelId} = ? AND ${cols.seq} < ?
         ORDER BY ${cols.seq} DESC 
         LIMIT ?`,
        channelId,
        beforeSeq,
        limit
      );
      return rows.map(parseRow);
    }

    const rows = await conn.getAllAsync<MessageRow>(
      `SELECT * FROM messages 
       WHERE ${cols.channelId} = ?
       ORDER BY ${cols.seq} DESC 
       LIMIT ?`,
      channelId,
      limit
    );
    return rows.map(parseRow);
  },

  findPending: async (db?: SQLiteDatabase): Promise<LocalMessage[]> => {
    const conn = await resolveDb(db);
    const rows = await conn.getAllAsync<MessageRow>(
      `SELECT * FROM messages WHERE ${cols.syncStatus} = 'pending' ORDER BY ${cols.seq} ASC`
    );
    return rows.map(parseRow);
  },

  findByTempId: async (tempId: string, db?: SQLiteDatabase): Promise<LocalMessage | null> => {
    const conn = await resolveDb(db);
    const row = await conn.getFirstAsync<MessageRow>(
      `SELECT * FROM messages WHERE ${cols.tempId} = ?`,
      tempId
    );
    return row ? parseRow(row) : null;
  },

  insert: async (
    message: MessageDto,
    options?: { syncStatus?: SyncStatus; tempId?: string },
    db?: SQLiteDatabase
  ): Promise<void> => {
    const conn = await resolveDb(db);
    const { syncStatus = 'synced', tempId = null } = options ?? {};
    await conn.runAsync(
      `INSERT INTO messages (${cols.messageId}, ${cols.channelId}, ${cols.seq}, ${cols.syncStatus}, ${cols.tempId}, ${cols.data})
       VALUES (?, ?, ?, ?, ?, ?)`,
      message.messageId,
      message.channelId,
      message.seq,
      syncStatus,
      tempId,
      JSON.stringify(message)
    );
  },

  upsert: async (
    message: MessageDto,
    options?: { syncStatus?: SyncStatus; tempId?: string },
    db?: SQLiteDatabase
  ): Promise<void> => {
    const conn = await resolveDb(db);
    const { syncStatus = 'synced', tempId = null } = options ?? {};
    await conn.runAsync(
      `INSERT INTO messages (${cols.messageId}, ${cols.channelId}, ${cols.seq}, ${cols.syncStatus}, ${cols.tempId}, ${cols.data})
       VALUES (?, ?, ?, ?, ?, ?)
       ON CONFLICT(${cols.messageId}) DO UPDATE SET
         ${cols.seq} = excluded.${cols.seq},
         ${cols.syncStatus} = excluded.${cols.syncStatus},
         ${cols.data} = excluded.${cols.data}`,
      message.messageId,
      message.channelId,
      message.seq,
      syncStatus,
      tempId,
      JSON.stringify(message)
    );
  },

  upsertMany: async (messages: MessageDto[], db?: SQLiteDatabase): Promise<void> => {
    const conn = await resolveDb(db);
    const run = async () => {
      for (const message of messages) {
        await conn.runAsync(
          `INSERT INTO messages (${cols.messageId}, ${cols.channelId}, ${cols.seq}, ${cols.syncStatus}, ${cols.tempId}, ${cols.data})
           VALUES (?, ?, ?, ?, ?, ?)
           ON CONFLICT(${cols.messageId}) DO UPDATE SET
             ${cols.seq} = excluded.${cols.seq},
             ${cols.syncStatus} = 'synced',
             ${cols.data} = excluded.${cols.data}`,
          message.messageId,
          message.channelId,
          message.seq,
          'synced',
          null,
          JSON.stringify(message)
        );
      }
    };

    if (db) {
      await run();
    } else {
      await conn.withTransactionAsync(run);
    }
  },

  updateSyncStatus: async (
    tempId: string,
    syncStatus: SyncStatus,
    realMessageId?: string,
    realSeq?: number,
    db?: SQLiteDatabase
  ): Promise<void> => {
    const conn = await resolveDb(db);
    if (realMessageId && realSeq !== undefined) {
      const row = await conn.getFirstAsync<MessageRow>(
        `SELECT * FROM messages WHERE ${cols.tempId} = ?`,
        tempId
      );
      if (row) {
        const data = JSON.parse(row.data) as MessageDto;
        data.messageId = realMessageId;
        data.seq = realSeq;
        await conn.runAsync(
          `UPDATE messages SET 
             ${cols.messageId} = ?, 
             ${cols.seq} = ?,
             ${cols.syncStatus} = ?,
             ${cols.data} = ?
           WHERE ${cols.tempId} = ?`,
          realMessageId,
          realSeq,
          syncStatus,
          JSON.stringify(data),
          tempId
        );
      }
    } else {
      await conn.runAsync(
        `UPDATE messages SET ${cols.syncStatus} = ? WHERE ${cols.tempId} = ?`,
        syncStatus,
        tempId
      );
    }
  },

  delete: async (messageId: string, db?: SQLiteDatabase): Promise<void> => {
    const conn = await resolveDb(db);
    await conn.runAsync(
      `DELETE FROM messages WHERE ${cols.messageId} = ?`,
      messageId
    );
  },

  deleteByChannel: async (channelId: string, db?: SQLiteDatabase): Promise<void> => {
    const conn = await resolveDb(db);
    await conn.runAsync(
      `DELETE FROM messages WHERE ${cols.channelId} = ?`,
      channelId
    );
  },
};
