# Arena App - 코딩 룰

## 1. 공통 함수 추출 금지

- 공통으로 보이는 로직이라도 임의로 별도 함수로 빼지 않는다
- 각 위치에서 인라인으로 구현한다
- 공통 함수가 필요하면 Zina가 직접 요청할 때만 추출한다

**이유:** 섣부른 추상화보다 명시적인 코드가 낫다.

---

## 2. DB 레이어 패턴

### 폴더 구조
```
db/
├── schema/              # 스키마 정의 (테이블명, 컬럼, 타입)
│   ├── users.ts
│   ├── channels.ts
│   └── ...
└── queries/             # 쿼리 함수 (CRUD)
    ├── users.ts
    ├── channels.ts
    └── ...
```

### 스키마 파일 구조 (db/schema/테이블명.ts)

```typescript
// 1. 테이블명
export const tableName = 'users';

// 2. 컬럼 상수
export const cols = {
  userId: 'user_id',
  data: 'data',
} as const;

// 3. Row 타입
export type UserRow = {
  userId: string;
  data: string;
};

// 4. 파싱 헬퍼
export const parseRow = (row: UserRow): UserDto => JSON.parse(row.data);
```

### 쿼리 파일 구조 (db/queries/테이블명.ts)

```typescript
import { tableName, cols, parseRow, type UserRow } from '../schema/users';
import { getDatabase } from '../database';

const resolveDb = async (db?: SQLiteDatabase) => db ?? await getDatabase();

export const usersQuery = {
  findById: async (params: { userId: string }, db?: SQLiteDatabase) => {
    const { userId } = params;
    const conn = await resolveDb(db);
    const row = await conn.getFirstAsync<UserRow>(
      `SELECT * FROM ${tableName} WHERE ${cols.userId} = ?`,
      userId
    );
    return row ? parseRow(row) : null;
  },
  // ... 다른 쿼리들
};
```

### 사용 방법
```typescript
// Import
import { usersQuery, channelsQuery } from '@/db';

// 사용
const user = await usersQuery.findById({ userId });
const channels = await channelsQuery.findAll();
const messages = await messagesQuery.findByChannel({ channelId, limit: 50 }, db);
```

### 함수 파라미터 규칙
- 쿼리 파라미터: 첫 번째 인자 (객체 형태)
- db 파라미터: 두 번째 인자 (옵셔널, 트랜잭션용)

### upsertMany 트랜잭션 규칙
- 외부에서 db 전달 시: 자체 트랜잭션 안 만듦
- db 없을 시: `withTransactionAsync`로 묶음

---

## 3. 서버 DTO 사용

- 서버 DTO 타입은 Orval이 자동 생성 (`api/generated/models/`)
- DB `data` 컬럼 파싱 결과 = 서버 DTO 타입
- 별도 UI 모델은 필요한 경우에만 만듦 (조인 필요 시 등)

---

## 4. 스크린 폴더 구조

### 구조
```
screens/
  chat-tab/
    Header.tsx           # 1레벨 - 외부에서 import
    ChannelList.tsx      # 1레벨 - 외부에서 import
    controls/            # 2레벨 - 내부 전용
      ChannelItem.tsx
      ChannelAvatar.tsx
```

### 원칙
- `app/`은 라우팅만, 실제 로직은 `screens/`
- 1레벨: 외부에서 직접 import 가능
- 2레벨 (`controls/`): 해당 스크린 내부에서만 사용
- `components/`는 여러 스크린에서 공유하는 진짜 공통만

---

## 5. 컴포넌트 규칙

### Export 방식
- 파일당 1개 컴포넌트
- `export default function ComponentName()` 스타일
- index.ts로 re-export 하지 않음

```typescript
// 컴포넌트 파일
export default function Header() { ... }

// 사용처
import Header from "@/screens/chat-tab/Header";
```

---

## 6. 마이그레이션 규칙

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

---

## 7. 상태 관리 (현재 방침)

- 일단 `useState`로 시작
- 각 스크린에서 필요한 데이터만 로컬로 관리
- zustand: 여러 화면에서 같은 데이터 공유 필요 시 도입 검토
- ReactQuery: 메신저 특성상 사용 안 함 (캐싱 모델 안 맞음)
