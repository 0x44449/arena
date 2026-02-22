# Arena App - TODO

## 2026-01-08 기준 (chat-tab UI 목업 이후)

### chat-tab: mock → DB 전환
- [ ] `mockRooms` 제거
- [ ] `channelsTable.findAll()`로 채널 목록 조회
- [ ] 채널 → UI 매핑 정의
  - title (DM/그룹)
  - participants/avatar
  - lastMessage / lastMessageTime
  - unreadCount

### 리스트/성능
- [ ] FlatList 최적화 (keyExtractor, getItemLayout 검토)
- [ ] 빈 상태(EmptyState) 디자인/문구 확정

### 네비게이션
- [ ] 채널 아이템 클릭 시 채팅방 라우트로 이동
  - `app/(app)/chat/[channelId].tsx` (예정)

### Header 액션
- [ ] 검색/새 채팅 생성 등 액션 버튼 연결 (디자인 확정 후)

---

## 이후 단계
- [ ] 서버 → DB 초기 동기화
- [ ] WebSocket 수신 → DB 반영
- [ ] dbEvents/리렌더 전략 결정
