import type { SQLiteDatabase } from 'expo-sqlite';
import type { MessageDto } from '@/api/generated/models';
import { getDatabase } from '../database';
import {
  tableName,
  cols,
  parseRow,
  type MessageRow,
  type LocalMessage,
  type FindMessagesResult,
  type SyncStatus,
} from '../schema/messages';

// DB 가져오기 헬퍼
const resolveDb = async (db?: SQLiteDatabase) => db ?? await getDatabase();

export const messagesQuery = {
  findById: async (
    params: { messageId: string },
    db?: SQLiteDatabase
  ): Promise<LocalMessage | null> => {
    const { messageId } = params;
    const conn = await resolveDb(db);
    const row = await conn.getFirstAsync<MessageRow>(
      `SELECT * FROM ${tableName} WHERE ${cols.messageId} = ?`,
      messageId
    );
    return row ? parseRow(row) : null;
  },

  findByIds: async (
    params: { messageIds: string[] },
    db?: SQLiteDatabase
  ): Promise<LocalMessage[]> => {
    const { messageIds } = params;
    if (messageIds.length === 0) return [];
    const conn = await resolveDb(db);
    const placeholders = messageIds.map(() => '?').join(', ');
    const rows = await conn.getAllAsync<MessageRow>(
      `SELECT * FROM ${tableName} WHERE ${cols.messageId} IN (${placeholders})`,
      ...messageIds
    );
    return rows.map(parseRow);
  },

  findByChannel: async (
    params: {
      channelId: string;
      before?: string;
      after?: string;
      around?: string;
      limit?: number;
    },
    db?: SQLiteDatabase
  ): Promise<FindMessagesResult> => {
    const { channelId, before, after, around, limit = 50 } = params;
    const conn = await resolveDb(db);

    // around: 해당 메시지 기준 앞뒤로 조회
    if (around) {
      const pivotRow = await conn.getFirstAsync<MessageRow>(
        `SELECT * FROM ${tableName} WHERE ${cols.messageId} = ? AND ${cols.channelId} = ?`,
        around,
        channelId
      );
      if (!pivotRow) {
        return { messages: [], hasNext: false, hasPrev: false };
      }

      const halfLimit = Math.floor(limit / 2);

      // pivot 이전 메시지 (+1개로 hasPrev 판단)
      const beforeRows = await conn.getAllAsync<MessageRow>(
        `SELECT * FROM ${tableName}
         WHERE ${cols.channelId} = ? AND ${cols.seq} < ?
         ORDER BY ${cols.seq} DESC
         LIMIT ?`,
        channelId,
        pivotRow.seq,
        halfLimit + 1
      );
      const hasPrev = beforeRows.length > halfLimit;
      const actualBeforeRows = beforeRows.slice(0, halfLimit);

      // pivot 이후 메시지 (+1개로 hasNext 판단)
      const afterRows = await conn.getAllAsync<MessageRow>(
        `SELECT * FROM ${tableName}
         WHERE ${cols.channelId} = ? AND ${cols.seq} > ?
         ORDER BY ${cols.seq} ASC
         LIMIT ?`,
        channelId,
        pivotRow.seq,
        halfLimit + 1
      );
      const hasNext = afterRows.length > halfLimit;
      const actualAfterRows = afterRows.slice(0, halfLimit);

      // 합쳐서 seq 오름차순 정렬
      const combinedRows = [
        ...actualBeforeRows.reverse(),
        pivotRow,
        ...actualAfterRows,
      ];

      return {
        messages: combinedRows.map(parseRow),
        hasNext,
        hasPrev,
      };
    }

    // before: 해당 메시지 이전 조회
    if (before) {
      const pivotRow = await conn.getFirstAsync<MessageRow>(
        `SELECT * FROM ${tableName} WHERE ${cols.messageId} = ? AND ${cols.channelId} = ?`,
        before,
        channelId
      );
      if (!pivotRow) {
        return { messages: [], hasNext: false, hasPrev: false };
      }

      // +1개로 hasPrev 판단
      const rows = await conn.getAllAsync<MessageRow>(
        `SELECT * FROM ${tableName}
         WHERE ${cols.channelId} = ? AND ${cols.seq} < ?
         ORDER BY ${cols.seq} DESC
         LIMIT ?`,
        channelId,
        pivotRow.seq,
        limit + 1
      );

      const hasPrev = rows.length > limit;
      const actualRows = rows.slice(0, limit).reverse();

      return {
        messages: actualRows.map(parseRow),
        hasNext: true,
        hasPrev,
      };
    }

    // after: 해당 메시지 이후 조회
    if (after) {
      const pivotRow = await conn.getFirstAsync<MessageRow>(
        `SELECT * FROM ${tableName} WHERE ${cols.messageId} = ? AND ${cols.channelId} = ?`,
        after,
        channelId
      );
      if (!pivotRow) {
        return { messages: [], hasNext: false, hasPrev: false };
      }

      // +1개로 hasNext 판단
      const rows = await conn.getAllAsync<MessageRow>(
        `SELECT * FROM ${tableName}
         WHERE ${cols.channelId} = ? AND ${cols.seq} > ?
         ORDER BY ${cols.seq} ASC
         LIMIT ?`,
        channelId,
        pivotRow.seq,
        limit + 1
      );

      const hasNext = rows.length > limit;
      const actualRows = rows.slice(0, limit);

      return {
        messages: actualRows.map(parseRow),
        hasNext,
        hasPrev: true,
      };
    }

    // 기본: 최신 메시지부터 (채팅방 처음 진입 시)
    const rows = await conn.getAllAsync<MessageRow>(
      `SELECT * FROM ${tableName}
       WHERE ${cols.channelId} = ?
       ORDER BY ${cols.seq} DESC
       LIMIT ?`,
      channelId,
      limit + 1
    );

    const hasPrev = rows.length > limit;
    const actualRows = rows.slice(0, limit).reverse();

    return {
      messages: actualRows.map(parseRow),
      hasNext: false,
      hasPrev,
    };
  },

  findPending: async (db?: SQLiteDatabase): Promise<LocalMessage[]> => {
    const conn = await resolveDb(db);
    const rows = await conn.getAllAsync<MessageRow>(
      `SELECT * FROM ${tableName} WHERE ${cols.syncStatus} = 'pending' ORDER BY ${cols.seq} ASC`
    );
    return rows.map(parseRow);
  },

  findByTempId: async (
    params: { tempId: string },
    db?: SQLiteDatabase
  ): Promise<LocalMessage | null> => {
    const { tempId } = params;
    const conn = await resolveDb(db);
    const row = await conn.getFirstAsync<MessageRow>(
      `SELECT * FROM ${tableName} WHERE ${cols.tempId} = ?`,
      tempId
    );
    return row ? parseRow(row) : null;
  },

  insert: async (
    params: {
      message: MessageDto;
      syncStatus?: SyncStatus;
      tempId?: string;
    },
    db?: SQLiteDatabase
  ): Promise<void> => {
    const { message, syncStatus = 'synced', tempId = null } = params;
    const conn = await resolveDb(db);
    await conn.runAsync(
      `INSERT INTO ${tableName} (${cols.messageId}, ${cols.channelId}, ${cols.seq}, ${cols.syncStatus}, ${cols.tempId}, ${cols.data})
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
    params: {
      message: MessageDto;
      syncStatus?: SyncStatus;
      tempId?: string;
    },
    db?: SQLiteDatabase
  ): Promise<void> => {
    const { message, syncStatus = 'synced', tempId = null } = params;
    const conn = await resolveDb(db);
    await conn.runAsync(
      `INSERT INTO ${tableName} (${cols.messageId}, ${cols.channelId}, ${cols.seq}, ${cols.syncStatus}, ${cols.tempId}, ${cols.data})
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

  upsertMany: async (
    params: { messages: MessageDto[] },
    db?: SQLiteDatabase
  ): Promise<void> => {
    const { messages } = params;
    const conn = await resolveDb(db);
    const run = async () => {
      for (const message of messages) {
        await conn.runAsync(
          `INSERT INTO ${tableName} (${cols.messageId}, ${cols.channelId}, ${cols.seq}, ${cols.syncStatus}, ${cols.tempId}, ${cols.data})
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
    params: {
      tempId: string;
      syncStatus: SyncStatus;
      realMessageId?: string;
      realSeq?: number;
    },
    db?: SQLiteDatabase
  ): Promise<void> => {
    const { tempId, syncStatus, realMessageId, realSeq } = params;
    const conn = await resolveDb(db);
    if (realMessageId && realSeq !== undefined) {
      const row = await conn.getFirstAsync<MessageRow>(
        `SELECT * FROM ${tableName} WHERE ${cols.tempId} = ?`,
        tempId
      );
      if (row) {
        const data = JSON.parse(row.data) as MessageDto;
        data.messageId = realMessageId;
        data.seq = realSeq;
        await conn.runAsync(
          `UPDATE ${tableName} SET 
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
        `UPDATE ${tableName} SET ${cols.syncStatus} = ? WHERE ${cols.tempId} = ?`,
        syncStatus,
        tempId
      );
    }
  },

  delete: async (
    params: { messageId: string },
    db?: SQLiteDatabase
  ): Promise<void> => {
    const { messageId } = params;
    const conn = await resolveDb(db);
    await conn.runAsync(
      `DELETE FROM ${tableName} WHERE ${cols.messageId} = ?`,
      messageId
    );
  },

  deleteByChannel: async (
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
