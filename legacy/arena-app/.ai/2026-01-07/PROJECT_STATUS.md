# Arena App - 프로젝트 현황 (2026-01-07 기준)

## 기술 스택
- **Framework**: Expo 54 + React Native 0.81
- **Router**: Expo Router 6 (file-based routing)
- **상태관리**: useState (컴포넌트 로컬), Zustand (auth만)
- **API 클라이언트**: Orval (Swagger → 타입/함수 자동 생성)
- **인증**: Supabase (카카오/구글 소셜 로그인)
- **로컬 DB**: expo-sqlite (오프라인 퍼스트 아키텍처)
- **UI**: 직접 작성 (별도 UI 라이브러리 없음)

---

## 프로젝트 구조

```
arena-app/
├── app/                      # Expo Router 페이지 (라우팅만)
│   ├── _layout.tsx
│   ├── (auth)/
│   │   └── login.tsx
│   └── (app)/
│       ├── _layout.tsx
│       ├── index.tsx
│       ├── welcome.tsx
│       └── (tabs)/
│           ├── _layout.tsx
│           ├── chat-tab.tsx    # screens import
│           ├── friend-tab.tsx  # mock 데이터 (미전환)
│           └── more-tab.tsx
│
├── screens/                  # 실제 화면 로직
│   ├── chat-tab/
│   │   ├── Header.tsx        # 1레벨
│   │   ├── ChannelList.tsx   # 1레벨 - DB 조회
│   │   └── controls/         # 2레벨 - 내부 전용
│   │       ├── ChannelItem.tsx
│   │       └── ChannelAvatar.tsx
│   └── friend-tab/           # 빈 파일 (작업 예정)
│
├── api/
│   ├── api-client.ts
│   └── generated/            # Orval 자동 생성
│
├── db/
│   ├── index.ts
│   ├── database.ts
│   ├── migrations/
│   └── schema/
│       ├── users.ts
│       ├── channels.ts
│       ├── messages.ts
│       ├── contacts.ts
│       ├── sync-queue.ts
│       └── sync-state.ts
│
├── stores/
│   └── useAuthStore.ts
│
└── libs/
    ├── supabase/
    └── common-style/
```

---

## 핵심 아키텍처: 오프라인 퍼스트

### 데이터 흐름 (목표)
```
서버 API ──────────────────────┐
                               ▼
              ┌─────────────────────┐
              │       SQLite        │ ← Source of Truth
              └──────────┬──────────┘
                         │
         ┌───────────────┼───────────────┐
         ▼               ▼               ▼
    ChannelList     FriendList      ChatRoom
    (useState)      (useState)      (useState)
```

### 현재 구현 상태
- [x] SQLite 스키마 및 CRUD
- [x] ChannelList → DB 조회
- [ ] 서버 → DB 동기화 (미구현)
- [ ] WebSocket 실시간 업데이트 (미구현)
- [ ] dbEvents 시스템 (보류)

---

## DB 함수 시그니처

### 파라미터 규칙
- 쿼리 파라미터: 첫 번째 인자 (객체)
- db 파라미터: 두 번째 인자 (옵셔널, 트랜잭션용)

```typescript
// 예시
await usersTable.findById({ userId }, db);
await channelsTable.findAll(db);
await messagesTable.findByChannel({ channelId, before, limit }, db);
await messagesTable.upsert({ message, syncStatus, tempId }, db);
```

### 메시지 조회 (커서 기반)
```typescript
messagesTable.findByChannel({
  channelId: string;
  before?: string;   // 이 메시지 이전
  after?: string;    // 이 메시지 이후
  around?: string;   // 이 메시지 기준 앞뒤
  limit?: number;    // 기본 50
}, db?)

// 반환
{ messages: LocalMessage[], hasNext: boolean, hasPrev: boolean }
```

---

## 컴포넌트 규칙

### Export 방식
```typescript
// 컴포넌트 파일
export default function Header() { ... }

// 사용처에서 직접 import
import Header from "@/screens/chat-tab/Header";
```

### 폴더 구조
- 1레벨: 외부에서 직접 import
- 2레벨 (`controls/`): 해당 스크린 내부에서만 사용
- index.ts re-export 사용 안 함

---

## 다음 작업

1. **서버 → DB 동기화**
   - 앱 시작 시 채널 목록 fetch → DB 저장
   - 트리거 위치 결정 필요

2. **friend-tab 스크린 전환**
   - chat-tab과 동일한 패턴으로

3. **채팅방 화면**
   - `app/(app)/chat/[channelId].tsx`
   - 메시지 목록 + 입력

---

## 환경 설정

### 백엔드 API
- URL: `http://localhost:8002`
- Swagger: `http://localhost:8002/swagger-json`

### 빌드/실행
```bash
npm start           # 개발 서버
npm run ios         # iOS
npm run android     # Android
npm run orval       # API 클라이언트 재생성
npm run typecheck   # 타입 체크
```
