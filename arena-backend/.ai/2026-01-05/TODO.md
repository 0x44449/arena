# Arena Backend - TODO

## 완료된 작업 ✅

### 서버 MVP (클라이언트 연동 준비 완료)
- [x] 인증 (Supabase JWT, ES256)
- [x] 유저 CRUD
- [x] 채널 (DM/그룹 생성, 목록, 상세)
- [x] 메시지 (전송, cursor pagination 조회)
- [x] 메시지 Sync API
- [x] 연락처 (추가, 목록, 삭제)
- [x] 파일 (presigned URL, 등록)
- [x] WebSocket (실시간 메시지)
- [x] 세션 캐싱 (Redis, 5분 TTL)
- [x] Soft Delete 지원 (Entity, 마이그레이션)
- [x] DTO/Swagger 정리

---

## 다음 작업: 클라이언트 연동

### 즉시 해야 할 것
- [ ] 클라이언트에서 API 연결 테스트
- [ ] 클라이언트에서 WebSocket 연결 테스트
- [ ] 파일 업로드 플로우 테스트 (presigned URL → S3 → register)

### 클라이언트 상태 관리 결정
- [ ] React Query vs Zustand vs 조합 결정
- [ ] 정규화 구조 설계
- [ ] 웹소켓 연동 방식 결정
- [ ] Sync API 활용 방식 결정

---

## 나중에 구현 (MVP 이후)

### Channel 관련
- [ ] Team Channel 구현
- [ ] 채널 나가기/삭제
- [ ] 초대/강퇴 로직

### Message 관련
- [ ] 메시지 수정
- [ ] 메시지 삭제
- [ ] 파일 첨부
- [ ] 답장 (reply)
- [ ] 읽음 처리 (lastReadAt 컬럼 이미 존재)
- [ ] 타이핑 인디케이터

### Contact 관련
- [ ] 별명 (nickname) 기능
- [ ] 즐겨찾기/차단 기능 (필요시)

### 기타
- [ ] participants 많아지면 Query 패턴 또는 페이지네이션 도입

---

## 구조 개선 (나중에)

- [ ] MessageService에서 DTO 변환 제거 (레이어 원칙 준수)
  - 현재: Service에서 DTO 변환 후 Signal 발행
  - 개선: Entity로 이벤트 발행, Gateway에서 DTO 변환
  - 참고: src/modules/message/message.service.ts의 TODO 주석
