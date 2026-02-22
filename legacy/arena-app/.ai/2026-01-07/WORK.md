# 2026-01-07 작업 내역

## 1. DB 스키마 함수 시그니처 개선

### 변경 내용
- 모든 스키마 함수의 파라미터를 객체 형태로 변경
- `db` 파라미터는 트랜잭션용이므로 별도 두 번째 파라미터로 분리

### 변경 전
```typescript
await usersTable.findById(userId, db);
await messagesTable.findByChannel(channelId, { limit: 50, beforeSeq: 100 }, db);
```

### 변경 후
```typescript
await usersTable.findById({ userId }, db);
await messagesTable.findByChannel({ channelId, limit: 50, before: 'msg123' }, db);
```

### 수정된 파일
- `db/schema/users.ts`
- `db/schema/channels.ts`
- `db/schema/messages.ts`
- `db/schema/contacts.ts`
- `db/schema/sync-queue.ts`
- `db/schema/sync-state.ts`

---

## 2. 메시지 조회 함수 개선

### findByChannel 커서 기반 페이지네이션
서버 API와 동일하게 `before`, `after`, `around` 커서 기반으로 변경

```typescript
messagesTable.findByChannel({
  channelId: string;
  before?: string;   // 이 메시지 이전 (미포함)
  after?: string;    // 이 메시지 이후 (미포함)
  around?: string;   // 이 메시지 기준 앞뒤 (포함)
  limit?: number;    // 기본 50
}, db?)

// 반환 타입
type FindMessagesResult = {
  messages: LocalMessage[];
  hasNext: boolean;
  hasPrev: boolean;
};
```

---

## 3. 스크린 폴더 구조 확립

### 구조 원칙
- `app/` - 라우팅만 담당
- `screens/` - 실제 화면 로직 + 종속 컴포넌트
- `components/` - 진짜 공통 컴포넌트만 (아직 없음)
- 1레벨: 외부에서 import 가능
- 2레벨 (`controls/`): 내부에서만 사용

### 현재 구조
```
screens/
  chat-tab/
    Header.tsx              # 1레벨 - 헤더
    ChannelList.tsx         # 1레벨 - 채널 목록 (DB 조회)
    controls/
      ChannelAvatar.tsx     # 2레벨 - 아바타 (1인, 2인, 3인, 4인 레이아웃)
      ChannelItem.tsx       # 2레벨 - 채널 아이템

app/(app)/(tabs)/
  chat-tab.tsx              # screens에서 직접 import
```

### 컴포넌트 export 규칙
- 파일당 1개 컴포넌트
- `export default function ComponentName()` 스타일
- index.ts로 re-export 하지 않음
- 직접 파일 경로로 import

```typescript
// app/(app)/(tabs)/chat-tab.tsx
import Header from "@/screens/chat-tab/Header";
import ChannelList from "@/screens/chat-tab/ChannelList";
```

---

## 4. ChannelList 구현

### 현재 상태
- DB에서 채널 목록 조회하여 렌더링
- DB가 비어있으면 "아직 대화가 없습니다" 표시
- 서버 동기화 로직은 아직 없음

### 코드 흐름
```typescript
// ChannelList.tsx
useEffect(() => {
  channelsTable.findAll().then((data) => {
    setChannels(data);
    setIsLoading(false);
  });
}, []);
```

---

## 변경된 파일 목록

### 신규 생성
- `screens/chat-tab/Header.tsx`
- `screens/chat-tab/ChannelList.tsx`
- `screens/chat-tab/controls/ChannelAvatar.tsx`
- `screens/chat-tab/controls/ChannelItem.tsx`

### 수정
- `app/(app)/(tabs)/chat-tab.tsx` - mock 제거, screens import로 변경
- `db/schema/*.ts` - 파라미터 객체 형태로 변경
- `db/schema/index.ts` - FindMessagesOptions export 제거
