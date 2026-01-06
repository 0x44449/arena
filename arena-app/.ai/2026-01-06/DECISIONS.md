# Arena App - 설계 결정 기록

## 2026-01-06

### 1. 오프라인 퍼스트 아키텍처 채택

**배경**
- 네트워크 연결 없어도 로컬 데이터로 앱 사용 가능해야 함
- 오프라인에서 메시지 전송 → 온라인 되면 싱크

**선택지**
1. React Query + Persister (캐시 영속화)
2. Zustand + MMKV (정규화 스토어)
3. WatermelonDB / RxDB (로컬 DB)
4. 직접 SQLite 구현

**결론: 직접 SQLite 구현**
- expo-sqlite 사용
- 완전한 제어권
- 서버 Sync API와 잘 맞음
- 나중에 필요하면 WatermelonDB로 마이그레이션 가능

---

### 2. SQLite 스키마: JSON blob 패턴

**배경**
- 서버 DTO 필드가 많고 자주 변경될 수 있음
- 모든 필드를 컬럼으로 만들면 마이그레이션 부담

**결론**
- 인덱싱/검색 필요한 필드만 컬럼으로 분리
- 나머지는 `data` 컬럼에 JSON으로 저장

```sql
CREATE TABLE messages (
  message_id TEXT PRIMARY KEY,
  channel_id TEXT NOT NULL,  -- 검색용
  seq INTEGER NOT NULL,      -- 정렬용
  sync_status TEXT,          -- 로컬 전용
  data TEXT NOT NULL         -- JSON(MessageDto)
);
```

**장점**
- 서버 DTO 필드 추가돼도 마이그레이션 불필요
- 스키마 단순
- ORM 불필요

**단점**
- JSON 내부 필드로 WHERE 조건 어려움 (필요하면 컬럼 추가)

---

### 3. ORM 사용 안 함

**배경**
- Drizzle 같은 ORM 검토
- JSON blob 패턴에서는 ORM 이점 적음

**결론: 순수 SQL**
- 컬럼 상수로 오타 방지
- 타입은 수동 정의
- 쿼리는 SQL 문자열 직접 작성

```typescript
const cols = {
  messageId: 'message_id',
  channelId: 'channel_id',
  // ...
} as const;

// 쿼리에서 cols.xxx로 참조
```

---

### 4. 비동기 DB 함수 사용

**배경**
- expo-sqlite는 동기/비동기 API 둘 다 제공
- 동기 API (`runSync`, `getAllSync`)는 JS 스레드 블로킹

**결론: 비동기 API 사용**
- `runAsync`, `getAllAsync` 사용
- 대량 데이터 처리 시 UI 블로킹 방지

---

### 5. db 파라미터 옵셔널

**배경**
- 일반 사용: 간단하게 호출하고 싶음
- 트랜잭션: 여러 작업을 같은 연결로 묶어야 함

**결론**
```typescript
// 일반 사용
await messagesTable.findByChannel(channelId);

// 트랜잭션
const db = await getDatabase();
await db.withTransactionAsync(async () => {
  await messagesTable.upsertMany(messages, db);
  await channelsTable.upsert(channel, db);
});
```

---

### 6. UI 상태 관리: useState + 이벤트

**배경**
- Zustand로 전역 상태? vs useState로 컴포넌트 로컬?
- UI는 DB만 바라봐야 함

**결론**
- Zustand 사용 안 함 (인증 제외)
- Sync Engine → DB에 쓰기 → 이벤트 발행
- UI 훅 → 이벤트 구독 → DB 쿼리 → useState 업데이트

```typescript
// Sync Engine
await messagesTable.upsertMany(messages);
dbEvents.emit('messages:changed', { channelId, created, updated, deleted });

// UI Hook
useEffect(() => {
  const handler = (event) => {
    // 변경된 ID만 DB에서 다시 쿼리
    const changed = await messagesTable.findByIds(event.updated);
    setMessagesById(prev => { ... });
  };
  dbEvents.on('messages:changed', handler);
  return () => dbEvents.off('messages:changed', handler);
}, []);
```

**장점**
- UI가 DB만 바라봄 (원칙 준수)
- 부분 업데이트 가능
- Zustand 없이 단순

---

## 참고: 백엔드 연동 포인트

### API
- `GET /messages/channel/:channelId/sync?since=ISO8601` - Delta 동기화
- `POST /messages/channel/:channelId` - 메시지 전송
- 응답에 `messageId`, `seq` 포함

### WebSocket
- 경로: `/ws`, 네임스페이스: `/arena`
- 이벤트: `message:new` - 새 메시지 수신
