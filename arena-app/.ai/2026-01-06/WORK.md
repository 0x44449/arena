# 2026-01-06 작업 내역

## 1. SQLite 로컬 DB 구조 설계 및 구현

### 배경
- 오프라인 퍼스트 아키텍처 채택
- UI는 SQLite만 바라보고, Sync Engine이 백그라운드에서 서버와 동기화

### 설계 원칙
- 인덱싱/검색 필요한 컬럼만 분리 (PK, FK, 정렬용)
- 나머지는 `data` 컬럼에 JSON blob으로 저장
- 서버 DTO 변경 시 마이그레이션 불필요

### 구현된 파일

```
db/
├── index.ts              # re-export
├── database.ts           # getDatabase, closeDatabase, resetDatabase
├── migrations/
│   ├── index.ts          # 마이그레이션 러너
│   └── 001_init.ts       # 테이블 생성 DDL
└── schema/
    ├── index.ts          # re-export
    ├── users.ts          # usersTable
    ├── channels.ts       # channelsTable
    ├── messages.ts       # messagesTable
    ├── contacts.ts       # contactsTable
    ├── sync-queue.ts     # syncQueueTable
    └── sync-state.ts     # syncStateTable
```

---

## 2. 스키마 테이블별 CRUD 구현

### 공통 패턴

```typescript
// 컬럼 상수
const cols = {
  userId: 'user_id',
  data: 'data',
} as const;

// Row 타입
export type UserRow = {
  userId: string;
  data: string; // JSON
};

// DB 파라미터 옵셔널 (트랜잭션 지원)
const resolveDb = async (db?: SQLiteDatabase) => db ?? await getDatabase();

// CRUD 함수
export const usersTable = {
  findById: async (userId: string, db?: SQLiteDatabase) => { ... },
  upsert: async (user: UserDto, db?: SQLiteDatabase) => { ... },
  // ...
};
```

### 주요 결정사항

1. **비동기 함수 사용**
   - `runSync`, `getAllSync` → `runAsync`, `getAllAsync`
   - 이유: 동기 함수는 JS 스레드 블로킹, 대량 데이터 시 UI 멈춤

2. **db 파라미터 옵셔널**
   - 일반 사용: `await usersTable.findById(userId)`
   - 트랜잭션: `await usersTable.upsert(user, db)`

3. **upsertMany 트랜잭션 처리**
   - 외부에서 db 넘기면 자체 트랜잭션 안 만듦 (상위 트랜잭션에 포함)
   - db 없으면 자체 트랜잭션으로 묶음

---

## 3. 메시지 로컬 상태 확장

### LocalMessage 타입

```typescript
export type LocalMessage = MessageDto & {
  syncStatus: 'pending' | 'synced' | 'failed';
  tempId: string | null;
};
```

- `syncStatus`: 오프라인 전송 상태 추적
- `tempId`: 낙관적 업데이트용 임시 ID

### 오프라인 메시지 전송 플로우 (설계)

```
1. 사용자가 메시지 입력
2. tempId 생성, syncStatus='pending'으로 DB 저장
3. UI 즉시 반영
4. 서버 전송 시도
   - 성공: syncStatus='synced', 실제 messageId/seq로 업데이트
   - 실패 (오프라인): sync_queue에 추가
   - 실패 (에러): syncStatus='failed'
5. 온라인 복귀 시 sync_queue 처리
```

---

## 4. 마이그레이션 시스템

### 구조

```typescript
// 001_init.ts
export default {
  version: 1,
  up: `CREATE TABLE users ...`,
};

// migrations/index.ts
const migrations = [m001, m002, ...];

export const runMigrations = async (db) => {
  // _migrations 테이블로 버전 관리
  // 현재 버전보다 높은 마이그레이션만 실행
};
```

### 실행 시점
- `getDatabase()` 최초 호출 시 자동 실행

---

## 5. 순환 참조 해결

### 문제
- `schema/*.ts` → `index.ts`의 `getDatabase` import
- `index.ts` → `schema/*.ts` re-export
- 순환 참조 발생

### 해결
- `database.ts` 분리
- `index.ts`는 re-export만
- `schema/*.ts` → `database.ts`에서 import

---

## 변경된 파일 목록

### 신규 생성
- `db/index.ts`
- `db/database.ts`
- `db/migrations/index.ts`
- `db/migrations/001_init.ts`
- `db/schema/index.ts`
- `db/schema/users.ts`
- `db/schema/channels.ts`
- `db/schema/messages.ts`
- `db/schema/contacts.ts`
- `db/schema/sync-queue.ts`
- `db/schema/sync-state.ts`
