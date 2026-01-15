# 2026-01-15 작업 내역

## 1. API 코드 생성 도구 변경

### Orval 유지 + operationId 추가
- 서버 컨트롤러에 `operationId` 명시하여 함수명 깔끔하게 생성
- `useGetMyChannels`, `useCreateMessage` 등으로 개선

### 수정된 컨트롤러
- `channel.controller.ts` - createDirectChannel, createGroupChannel, getMyChannels, getChannel
- `user.controller.ts` - getMe, getUser, updateMe, createUser
- `message.controller.ts` - createMessage, getMessages, syncMessages
- `contact.controller.ts` - getContacts, createContact, deleteContact
- `file.controller.ts` - getPresignedUrl, registerFile, getPrivatePresignedUrl, registerPrivateFile, getFile, deleteFile
- `device.controller.ts` - registerDevice, unregisterDevice

### orval 스크립트 수정
```json
"orval": "curl -s http://localhost:8002/swagger-json > ./api/swagger.json && orval --config orval.config.ts"
```
- URL에서 직접 fetch 안 되는 버그 있어서 curl로 먼저 저장 후 사용

---

## 2. ChatTabScreen API 연결

### 변경 사항
- Mock 데이터 제거
- `useGetMyChannels()` 훅 사용
- `ChannelDto` → UI props 변환 로직 추가
  - `getChannelTitle()`: 그룹명 또는 상대방 닉네임
  - `getParticipants()`: 아바타 URL 매핑
  - `formatTime()`: 날짜 포맷팅

### 미연결 항목
- `lastMessage`: 서버 ChannelDto에 없음
- `unreadCount`: 서버 ChannelDto에 없음

---

## 3. ChatScreen (대화방) 구현

### 폴더 구조 변경
- `screens/chat-room/` → `screens/chat/`
- `ChatRoomScreen` → `ChatScreen`

### 단순화
- `LegendList` → `FlatList` + `inverted`
- Header: BlurView 제거, 상단 고정
- MessageInput: KeyboardStickyView 제거, 하단 고정
- `KeyboardAvoidingView`로 감싸서 키보드 대응

### API 연결
- `useGetChannel()`: 채널 정보
- `useGetMessages()`: 메시지 목록 (staleTime: 0, gcTime: 0)
- `useGetMe()`: 현재 사용자 ID
- `useCreateMessage()`: 메시지 전송

### 메시지 전송 흐름
1. 입력 → trim 체크
2. 입력창 비우기
3. API 호출
4. 성공 시 `refetchMessages()`

---

## 4. 서버 - 메시지 seq 채번 방식 변경

### 기존 (Redis)
```typescript
const seq = await this.redis.incr(`channel:${channelId}:seq`);
```
- 문제: Redis 리셋 시 seq 꼬임, DB 직접 수정 시 싱크 안 맞음

### 변경 (DB 서브쿼리)
```typescript
await this.messageRepository.query(
  `INSERT INTO messages ("messageId", "channelId", "senderId", seq, content, "createdAt", "updatedAt")
   VALUES (
     $1, $2, $3, 
     (SELECT COALESCE(MAX(seq), 0) + 1 FROM messages WHERE "channelId" = $2),
     $4, NOW(), NOW()
   )`,
  [messageId, channelId, userId, content]
);
```
- DB가 atomic하게 seq 계산
- Redis 의존성 제거 (message.service.ts에서)
- 인덱스 `(channelId, seq)` 이미 존재하여 MAX 조회 빠름

### 성능
- Redis: ~0.1-0.5ms
- DB 서브쿼리 (인덱스 있음): ~1-5ms
- 둘 다 ms 단위로 체감 불가

---

## 5. 기타 수정

### common-style 추가
```typescript
center: { justifyContent: "center", alignItems: "center" }
```

### api/index.ts 정리
- 기존 auth 참조 제거
- 모든 엔드포인트 re-export

### app/(app)/_layout.tsx
- `useUserGetMeQuery` → `useGetMe`로 변경

---

## 현재 상태

### ✅ 완료
- 채팅 목록 화면 API 연결
- 대화방 화면 API 연결 (메시지 조회/전송)
- 서버 seq 채번 DB로 변경

### 🚧 미완료
- 채팅 목록 lastMessage, unreadCount 표시
- 실시간 메시지 수신 (WebSocket)
- 오프라인 아키텍처 (일단 보류)

### 📝 기술 부채
- raw query에 컬럼명 하드코딩 → 추후 stored procedure 또는 트랜잭션 락 방식으로 개선 검토
