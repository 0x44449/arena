# Arena App - 프로젝트 현황 (2026-01-06 기준)

## 기술 스택
- **Framework**: Expo 54 + React Native 0.81
- **Router**: Expo Router 6 (file-based routing)
- **상태관리**: Zustand (auth) + React Query 5
- **API 클라이언트**: Orval (Swagger → React Query hooks 자동 생성)
- **인증**: Supabase (카카오/구글 소셜 로그인)
- **로컬 DB**: expo-sqlite (오프라인 퍼스트 아키텍처)
- **UI**: 직접 작성 (별도 UI 라이브러리 없음)

---

## 프로젝트 구조

```
arena-app/
├── app/                      # Expo Router 페이지
│   ├── _layout.tsx           # Root: QueryClient, Auth 상태 감지
│   ├── (auth)/
│   │   ├── _layout.tsx
│   │   └── login.tsx         # 카카오/구글 로그인
│   └── (app)/
│       ├── _layout.tsx       # getUserMe 쿼리, token refresh
│       ├── index.tsx
│       ├── welcome.tsx       # 회원가입 온보딩 (미완성)
│       └── (tabs)/
│           ├── _layout.tsx
│           ├── friend-tab.tsx  # 연락처 목록 (mock)
│           ├── chat-tab.tsx    # 채팅 목록 (mock)
│           └── more-tab.tsx    # 더보기
│
├── api/                      # API 관련
│   ├── api-client.ts         # Axios + Supabase JWT 자동 주입
│   ├── index.ts
│   └── generated/            # Orval 자동 생성
│       ├── endpoints/        # React Query hooks
│       └── models/           # DTO 타입
│
├── db/                       # SQLite 로컬 DB (신규)
│   ├── index.ts              # re-export
│   ├── database.ts           # getDatabase, closeDatabase, resetDatabase
│   ├── migrations/
│   │   ├── index.ts          # 마이그레이션 러너
│   │   └── 001_init.ts       # 테이블 생성 DDL
│   └── schema/               # 테이블별 CRUD
│       ├── index.ts
│       ├── users.ts
│       ├── channels.ts
│       ├── messages.ts
│       ├── contacts.ts
│       ├── sync-queue.ts
│       └── sync-state.ts
│
├── stores/
│   └── useAuthStore.ts       # Zustand: Supabase 세션 관리
│
├── libs/
│   ├── supabase/             # Supabase 클라이언트
│   └── common-style/         # 공통 스타일
│
├── hooks/                    # (비어있음)
├── components/               # (비어있음)
├── constants/                # (비어있음)
│
├── orval.config.ts           # Orval 설정
├── app.json                  # Expo 설정
├── tsconfig.json
└── package.json
```

---

## 핵심 아키텍처: 오프라인 퍼스트

### 데이터 흐름

```
┌─────────────────────────────────────────────────────┐
│                    UI 컴포넌트                        │
│                        │                            │
│                        ▼                            │
│              ┌─────────────────┐                    │
│              │     SQLite      │  ← UI는 여기만 봄    │
│              │   (expo-sqlite) │                    │
│              └────────┬────────┘                    │
│                       │                            │
│         ┌─────────────┴─────────────┐              │
│         ▼                           ▼              │
│   ┌──────────┐                ┌──────────┐         │
│   │  Sync    │                │ WebSocket│         │
│   │  Engine  │                │ Handler  │         │
│   └────┬─────┘                └────┬─────┘         │
│        │                           │               │
└────────┼───────────────────────────┼───────────────┘
         │                           │
         ▼                           ▼
    ┌─────────────────────────────────────┐
    │              Arena Backend           │
    └─────────────────────────────────────┘
```

### 원칙
- **UI → SQLite만** 읽기/쓰기
- **Sync Engine** → 백그라운드에서 서버와 동기화 → DB에 쓰기 → 이벤트 발행
- **UI** → 이벤트 받고 → DB 쿼리해서 상태 갱신 (부분 업데이트)

### SQLite 스키마 설계 철학
- 인덱싱/검색 필요한 컬럼만 분리
- 나머지는 `data` 컬럼에 JSON blob으로 저장
- 서버 DTO 구조 변경 시 마이그레이션 불필요

---

## SQLite 테이블 구조

```sql
-- users
user_id TEXT PRIMARY KEY
data TEXT NOT NULL  -- JSON(UserDto)

-- channels
channel_id TEXT PRIMARY KEY
type TEXT NOT NULL  -- 'direct' | 'group' | 'team'
last_message_at TEXT
data TEXT NOT NULL  -- JSON(ChannelDto)

-- messages
message_id TEXT PRIMARY KEY
channel_id TEXT NOT NULL
seq INTEGER NOT NULL
sync_status TEXT DEFAULT 'synced'  -- 'pending' | 'synced' | 'failed'
temp_id TEXT
data TEXT NOT NULL  -- JSON(MessageDto)

-- contacts
user_id TEXT PRIMARY KEY
data TEXT NOT NULL  -- JSON(ContactDto)

-- sync_queue (오프라인 작업 큐)
id INTEGER PRIMARY KEY AUTOINCREMENT
type TEXT NOT NULL
payload TEXT NOT NULL
created_at TEXT NOT NULL
retry_count INTEGER DEFAULT 0

-- sync_state (동기화 상태 추적)
key TEXT PRIMARY KEY
last_synced_at TEXT NOT NULL
```

---

## API 연동 현황

### Orval 자동 생성 (완료)
```bash
npm run orval  # Swagger에서 React Query hooks 생성
```

### 생성된 엔드포인트
- `useUserGetMeQuery` - 내 정보 조회
- `useChannelsGetChannelsQuery` - 채널 목록
- `useMessagesGetMessagesQuery` - 메시지 목록
- `useContactsGetContactsQuery` - 연락처 목록
- 등등... (`api/generated/endpoints/` 참고)

### API 클라이언트 설정
- `api/api-client.ts` - Axios 인스턴스
- Supabase JWT 자동 주입 (interceptor)

---

## 인증 플로우

1. **로그인 화면** (`app/(auth)/login.tsx`)
   - 카카오/구글 소셜 로그인
   - `supabase.auth.signInWithIdToken()` 호출

2. **세션 감지** (`app/_layout.tsx`)
   - `supabase.auth.onAuthStateChange()` 구독
   - `useAuthStore`에 세션 저장

3. **화면 분기** (`Stack.Protected`)
   - `session` 있으면 → `(app)` 그룹
   - 없으면 → `(auth)` 그룹

4. **토큰 리프레시** (`app/(app)/_layout.tsx`)
   - `AppState` 감지
   - 포그라운드 복귀 시 `supabase.auth.startAutoRefresh()`

---

## 서버 DTO 타입 (Orval 생성)

주요 타입 (`api/generated/models/`):

```typescript
// UserDto
{
  userId: string;
  utag: string;
  nick: string;
  avatar?: FileDto;
  email?: string;
  statusMessage?: string;
  createdAt: string;
  updatedAt: string;
}

// ChannelDto
{
  channelId: string;
  type: 'direct' | 'group' | 'team';
  name?: string;
  icon?: FileDto;
  participants: ParticipantDto[];
  lastMessageAt?: string;
  createdAt: string;
  updatedAt: string;
}

// MessageDto
{
  messageId: string;
  channelId: string;
  sender: UserDto;
  seq: number;
  content: string;
  createdAt: string;
  updatedAt: string;
}

// ContactDto
{
  user: UserDto;
  createdAt: string;
  updatedAt: string;
}
```

---

## 환경 설정

### Supabase
- URL: `https://----.supabase.co`
- 클라이언트: `libs/supabase/client.ts`

### 백엔드 API
- URL: `http://localhost:8002`
- Swagger: `http://localhost:8002/swagger-json`

### 소셜 로그인
- 카카오: `app.json`에 kakaoAppKey 설정
- 구글: `app.json`에 iosUrlScheme 설정

---

## 빌드/실행

```bash
# 개발 서버
npm start

# iOS
npm run ios

# Android
npm run android

# Orval 재생성 (백엔드 API 변경 시)
npm run orval
```
