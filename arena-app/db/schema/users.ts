import type { UserDto } from '@/api/generated/models';

// 테이블명
export const tableName = 'users';

// 컬럼 정의
export const cols = {
  userId: 'user_id',
  data: 'data',
} as const;

// Row 타입
export type UserRow = {
  userId: string;
  data: string; // JSON(UserDto)
};

// 파싱 헬퍼
export const parseRow = (row: UserRow): UserDto => JSON.parse(row.data);
