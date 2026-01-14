# Arena App - TODO

## 2026-01-14 기준

### 높은 우선순위

#### 1. 이벤트 시스템 결정 및 구현
- [ ] 이벤트 방식 결정 (EventEmitter vs React Query vs 기타)
- [ ] 세밀도 결정 (테이블 단위 vs 아이템 단위)
- [ ] `offline/events.ts` 구현
- [ ] 테스트로 검증

#### 2. channels-engine 구현
- [ ] `initialize()`: 앱 시작 시 서버에서 채널 목록 fetch → DB 저장
- [ ] `add()`: 채널 생성 → API 호출 → DB 저장 → 이벤트 발생
- [ ] `update()`: 채널 수정
- [ ] `delete()`: 채널 삭제
- [ ] 에러 핸들링

#### 3. useChannels Hook 구현
- [ ] DB 초기 로드
- [ ] 이벤트 구독
- [ ] 재조회 로직
- [ ] 로딩/에러 상태 관리

#### 4. ChatTabScreen 실제 데이터 연결
- [ ] Mock 데이터 제거
- [ ] `useChannels()` 사용
- [ ] `channelsAction.xxx()` 연결
- [ ] 로딩/에러 UI

---

### 중간 우선순위

#### 5. 다른 엔티티 구현
- [ ] messages-engine
- [ ] contacts-engine
- [ ] users-engine

#### 6. 앱 초기화 흐름
- [ ] `app/_layout.tsx`에서 엔진 초기화
- [ ] 앱 시작 시 전체 동기화
- [ ] 로그인 상태 체크

#### 7. 서버 동기화 전략
- [ ] 주기적 동기화 (폴링 vs WebSocket)
- [ ] 백그라운드 동기화
- [ ] 동기화 실패 재시도

---

### 낮은 우선순위

#### 8. 채팅방 화면 데이터 연결
- [ ] `useMessages()` Hook
- [ ] messages-action 구현
- [ ] 메시지 전송 구현

#### 9. 친구 목록 화면 데이터 연결
- [ ] `useContacts()` Hook
- [ ] contacts-action 구현

#### 10. WebSocket 실시간 연결
- [ ] WebSocket 클라이언트 구현
- [ ] 실시간 메시지 수신
- [ ] 실시간 채널 업데이트

---

## 기술 부채

- [ ] 기존 `db/` 폴더 삭제 (현재 `offline/db/`로 이동 완료)
- [ ] Mock 데이터 정리
- [ ] 타입 정리 (DTO vs 로컬 타입)
- [ ] 에러 처리 전략 수립
