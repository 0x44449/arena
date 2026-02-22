# Arena App - TODO

## 완료된 작업 ✅

### 기본 구조
- [x] Expo Router 페이지 구조
- [x] Supabase 인증 (카카오/구글 소셜 로그인)
- [x] Orval API 클라이언트 자동 생성
- [x] SQLite 로컬 DB 스키마 및 CRUD

---

## 다음 작업: UI ↔ DB 연결

### 이벤트 시스템 구현
- [ ] DB 이벤트 발행 시스템 (`dbEvents`)
  - 메시지 변경: `messages:changed`
  - 채널 변경: `channels:changed`
  - 연락처 변경: `contacts:changed`
- [ ] DB 변경 시 이벤트 발행 로직 추가

### React 훅 구현
- [ ] `useMessages(channelId)` - 메시지 목록 + 이벤트 구독
- [ ] `useChannels()` - 채널 목록 + 이벤트 구독
- [ ] `useContacts()` - 연락처 목록 + 이벤트 구독
- [ ] 부분 업데이트 지원 (정규화 상태: messagesById + messageIds)

---

## Sync Engine 구현

### 기본 동기화
- [ ] 초기 동기화 (앱 시작 시)
  - 채널 목록 fetch → DB 저장
  - 연락처 목록 fetch → DB 저장
- [ ] Delta 동기화 (백그라운드 → 포그라운드)
  - `syncStateTable`에서 마지막 동기화 시간 조회
  - 서버 Sync API 호출 → 변경분만 DB 저장
  - 이벤트 발행 → UI 갱신

### 오프라인 쓰기
- [ ] 메시지 전송 (오프라인)
  - tempId로 로컬 저장 (pending)
  - sync_queue에 추가
- [ ] 온라인 복귀 시 sync_queue 처리
- [ ] 실패 시 재시도 로직

### WebSocket 연동
- [ ] Socket.IO 클라이언트 설정
- [ ] 실시간 메시지 수신 → DB 저장 → 이벤트 발행
- [ ] 연결 상태 관리

---

## 화면 구현

### 회원가입 플로우
- [ ] `welcome.tsx` → `POST /users` API 연결
- [ ] 아바타 업로드 (presigned URL 플로우)

### 연락처 탭
- [ ] mock 데이터 → DB 조회로 변경
- [ ] 연락처 추가 기능

### 채팅 목록 탭
- [ ] mock 데이터 → DB 조회로 변경
- [ ] 채널 생성 (DM, 그룹)

### 채팅방 화면 (신규)
- [ ] 메시지 목록 (무한 스크롤)
- [ ] 메시지 입력/전송
- [ ] 실시간 업데이트

---

## 나중에 구현 (MVP 이후)

### 메시지 기능
- [ ] 파일 첨부
- [ ] 답장 (reply)
- [ ] 수정/삭제
- [ ] 읽음 처리

### 채널 기능
- [ ] Team Channel
- [ ] 채널 나가기/삭제
- [ ] 초대/강퇴

### 기타
- [ ] 푸시 알림 (FCM)
- [ ] 타이핑 인디케이터
- [ ] 프로필 수정
