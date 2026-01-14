# 2026-01-14 작업 내역

## 1. DB 구조 개편 (procedures → queries)

### 변경 사항
- `db/procedures/` → `db/queries/`로 폴더명 변경
- 객체명을 복수형에서 단수형으로 변경
  - `channelsQueries` → `channelsQuery`
  - `messagesQueries` → `messagesQuery`
  - `usersQueries` → `usersQuery`
  - `contactsQueries` → `contactsQuery`
  - `syncQueueQueries` → `syncQueueQuery`
  - `syncStateQueries` → `syncStateQuery`

### 새로운 구조
```
db/
├── schema/          # 테이블 정의 (tableName, cols, types, parseRow)
├── queries/         # 쿼리 함수 (findAll, upsert 등)
├── database.ts
└── index.ts
```

### 사용 방법
```typescript
import { channelsQuery, messagesQuery } from '@/db';

const channels = await channelsQuery.findAll();
const messages = await messagesQuery.findByChannel({ channelId });
```

---

## 2. Offline 아키텍처 설계

### 디렉토리 구조
```
offline/
├── actions/         # UI가 호출하는 인터페이스
│   └── channels-action.ts
├── engines/         # 비즈니스 로직 (API ↔ DB 동기화)
│   └── channels-engine.ts
└── db/              # 기존 db 폴더 이동
    ├── queries/
    └── schema/
```

### Flux 패턴 적용

**데이터 흐름:**
```
UI → Action → Engine → API + DB + Event
                          ↓
UI ← DB 변경 이벤트 구독 ←―
```

**레이어 역할:**
- **Action**: UI가 호출하는 public API (dispatch)
- **Engine**: 실제 로직 처리 (reducer 역할)
  - API 호출
  - DB 업데이트
  - 이벤트 발생
- **Query**: DB CRUD

**핵심 원칙:**
- UI는 동기화 로직을 알 필요 없음
- UI는 DB 내용을 읽어서 화면에 표시만
- 데이터 변경은 이벤트로 통지

### 예시 코드 구조

```typescript
// actions/channels-action.ts
export const channelsAction = {
  add: async () => {
    // call engine (mutation)
  },
}

// engines/channels-engine.ts
export const channelsEngine = {
  initialize: async () => { 
    // load initial data from api
    // db update
    // send update event signal
  },

  add: async () => {
    // api call
    // db update
    // send update event signal
  },
}

// UI
export default function ChatTabScreen() {
  const channels = useChannels(); // DB 구독
  
  const handleAdd = () => {
    channelsAction.add(); // 액션만 호출
  };
  
  return <FlatList data={channels} />;
}
```

---

## 3. 미해결 이슈: 이벤트 시스템

### 논의된 옵션들

**Option 1: EventEmitter 패턴**
```typescript
offlineEvents.emit('channels:changed');
offlineEvents.on('channels:changed', () => { ... });
```
- 장점: 간단하고 가벼움
- 단점: 이벤트 종류가 많아짐

**Option 2: React Query 활용**
```typescript
queryClient.invalidateQueries(['channels']);
```
- 장점: 익숙한 패턴, 캐시 키 관리
- 단점: SQLite가 source of truth인데 React Query 쓰는 건 misuse

**Option 3: 테이블명 기반 이벤트**
```typescript
db.emit('channels');
db.on('channels', () => { ... });
```
- 장점: 간단
- 단점: 세밀한 제어 불가 (특정 아이템만 변경 시)

### 핵심 문제
1. 채널 목록 화면 - `findAll()` 구독
2. 채널 상세 화면 - `findById(channelId)` 구독
3. 한 개만 수정했는데 전체 재조회 (비효율)

### 고려할 방향
- 세밀한 이벤트: `channels:abc123` vs `channels:*`
- 데이터 포함 이벤트: `{ type: 'update', channelId, data }`
- React Query 스타일 키: `['channels']` vs `['channels', channelId]`

**결정 보류** - 다음 작업 시 선택 필요
