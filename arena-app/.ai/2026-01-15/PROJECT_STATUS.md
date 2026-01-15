# Arena App - 프로젝트 현황 (2026-01-15 기준)

## 아키텍처 방향 전환

### 기존 계획
- Offline 우선 구조 (SQLite + Engine + Action)
- 이벤트 시스템으로 DB 변경 감지

### 현재 방향
- **빠른 MVP 완성** 우선
- React Query로 서버 직접 호출
- Offline 아키텍처는 나중에

---

## 현재 구현 상태

### ✅ 프론트엔드

#### 채팅 목록 (ChatTabScreen)
- `useGetMyChannels()` 연결
- 채널 목록 표시
- 그룹/DM 아바타 구분

#### 대화방 (ChatScreen)
- `useGetChannel()` - 채널 정보
- `useGetMessages()` - 메시지 목록
- `useCreateMessage()` - 메시지 전송
- `inverted FlatList` + `KeyboardAvoidingView`

### ✅ 백엔드

#### API operationId 정리
- 모든 컨트롤러에 operationId 추가
- Orval 생성 함수명 깔끔해짐

#### 메시지 seq 채번
- Redis → DB 서브쿼리로 변경
- 동시성 문제 DB에서 atomic 처리

---

## 미구현

### 프론트엔드
- [ ] 채팅 목록 lastMessage 표시
- [ ] 채팅 목록 unreadCount 표시
- [ ] 실시간 메시지 수신
- [ ] 친구 목록 화면

### 백엔드
- [ ] ChannelDto에 lastMessage 추가
- [ ] 읽음 처리 및 unreadCount
- [ ] WebSocket 브로드캐스트 연결

---

## 폴더 구조

```
screens/
├── chat-tab/
│   ├── ChatTabScreen.tsx     # 채팅 목록
│   └── controls/
├── chat/
│   ├── ChatScreen.tsx        # 대화방
│   └── controls/
│       ├── Header.tsx
│       ├── MessageInput.tsx
│       └── MessageItem.tsx
└── friend-tab/

api/
├── api-client.ts
├── index.ts
├── swagger.json
└── generated/
    ├── endpoints/
    └── models/
```

---

## 기술 스택

### 프론트엔드
- React Native + Expo
- React Query (서버 상태)
- Orval (API 코드 생성)

### 백엔드
- NestJS + TypeORM
- PostgreSQL
- Redis (세션, pub/sub용 - seq 채번에서는 제거)
