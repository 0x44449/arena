# Arena App - 코딩 룰

## 1. 공통 함수 추출 금지

- 공통으로 보이는 로직이라도 임의로 별도 함수로 빼지 않는다
- 각 위치에서 인라인으로 구현한다
- 공통 함수가 필요하면 Zina가 직접 요청할 때만 추출한다

**이유:** 섣부른 추상화보다 명시적인 코드가 낫다.

---

## 2. DB 레이어 패턴

### 스키마 파일 구조

```typescript
// db/schema/테이블명.ts

// 1. 컬럼 상수
const cols = {
  userId: 'user_id',
  data: 'data',
} as const;

// 2. Row 타입
export type UserRow = { ... };

// 3. 파싱 헬퍼
const parseRow = (row: UserRow): UserDto => JSON.parse(row.data);

// 4. DB 헬퍼
const resolveDb = async (db?: SQLiteDatabase) => db ?? await getDatabase();

// 5. CRUD 객체
export const usersTable = {
  cols,
  findById: async (id, db?) => { ... },
  upsert: async (data, db?) => { ... },
  // ...
};
```

### db 파라미터 규칙
- 모든 CRUD 함수는 `db?: SQLiteDatabase`를 마지막 파라미터로 받음
- 일반 사용: 생략 → 내부에서 `getDatabase()` 호출
- 트랜잭션: 전달 → 같은 연결 사용

### upsertMany 트랜잭션 규칙
- 외부에서 db 전달 시: 자체 트랜잭션 안 만듦
- db 없을 시: `withTransactionAsync`로 묶음

---

## 3. 서버 DTO 사용

- 서버 DTO 타입은 Orval이 자동 생성 (`api/generated/models/`)
- DB `data` 컬럼 파싱 결과 = 서버 DTO 타입
- 별도 UI 모델은 필요한 경우에만 만듦 (조인 필요 시 등)

---

## 4. 이벤트 기반 UI 갱신

```typescript
// Sync/쓰기 레이어
await messagesTable.upsertMany(messages);
dbEvents.emit('messages:changed', { channelId, created, updated, deleted });

// UI 훅
const handler = (event) => {
  if (event.channelId !== channelId) return;
  // 변경된 것만 DB에서 다시 쿼리
};
dbEvents.on('messages:changed', handler);
```

- UI는 DB만 바라봄
- 이벤트로 "뭐가 바뀌었는지"만 알려줌
- UI가 직접 DB 쿼리해서 상태 갱신

---

## 5. 마이그레이션 규칙

### 파일명
- `XXX_설명.ts` 형식 (예: `001_init.ts`, `002_add_xxx.ts`)

### 구조
```typescript
export default {
  version: 1,  // 순차 증가
  up: `SQL 문`,
};
```

### 주의
- 기존 마이그레이션 수정 금지
- 새 마이그레이션 추가만 허용
- 개발 중에는 `resetDatabase()` 후 재생성 가능
