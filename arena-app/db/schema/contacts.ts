import type { ContactDto } from '@/api/generated/models';

// 테이블명
export const tableName = 'contacts';

// 컬럼 정의
export const cols = {
  userId: 'user_id',
  data: 'data',
} as const;

// Row 타입
export type ContactRow = {
  userId: string;
  data: string; // JSON(ContactDto)
};

// 파싱 헬퍼
export const parseRow = (row: ContactRow): ContactDto => JSON.parse(row.data);
