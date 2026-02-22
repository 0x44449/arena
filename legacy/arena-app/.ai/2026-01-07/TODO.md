# Arena App - TODO

## 완료된 작업 ✅

### 기본 구조
- [x] Expo Router 페이지 구조
- [x] Supabase 인증 (카카오/구글 소셜 로그인)
- [x] Orval API 클라이언트 자동 생성
- [x] SQLite 로컬 DB 스키마 및 CRUD
- [x] DB 함수 파라미터 객체 형태로 개선
- [x] 메시지 조회 커서 기반 페이지네이션 (before/after/around)

### 스크린 구조
- [x] screens 폴더 구조 확립 (1레벨/2레벨 분리)
- [x] chat-tab 스크린 분리 (Header, ChannelList)
- [x] ChannelItem, ChannelAvatar 컴포넌트 구현
- [x] ChannelList에서 DB 조회하여 렌더링

---

## 다음 작업: 서버 → DB 동기화

### 초기 동기화
- [ ] 앱 시작 시 서버에서 채널 목록 fetch → DB 저장
- [ ] 동기화 트리거 위치 결정 (`(app)/_layout.tsx`?)
- [ ] 동기화 완료 후 UI 갱신 방법 결정

### 검토 필요 사항
- 동기화 시작 시점: 앱 시작? 포그라운드 복귀?
- UI 갱신 방식: dbEvents? 단순 리렌더?
- 상태 관리: useState로 충분? zustand 필요?

---

## 이후 작업

### 실시간 업데이트
- [ ] WebSocket 연결 (Socket.IO)
- [ ] 실시간 이벤트 수신 → DB 저장
- [ ] dbEvents 시스템 구현 (필요 시)

### 채팅방 화면
- [ ] `app/(app)/chat/[channelId].tsx` 라우트
- [ ] 메시지 목록 (무한 스크롤)
- [ ] 메시지 입력/전송

### 연락처 탭
- [ ] friend-tab 스크린 분리
- [ ] DB 연동

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
