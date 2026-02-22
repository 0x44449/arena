# Arena App - 프로젝트 현황 (2026-01-08 기준)

## 전체 요약
- chat-tab 화면을 DB 연동 상태에서 분리하고, UI/레이아웃 중심의 목업 구현으로 전환
- Expo Router 라우트는 유지하되, 실제 화면 로직을 `ChatTabScreen` 단일 엔트리로 정리
- chat-tab 관련 컴포넌트들을 `controls/` 하위로 재배치

---

## chat-tab 현재 상태

### 구조
```
screens/chat-tab/
├── ChatTabScreen.tsx      # chat-tab 메인 화면 (mock 기반)
└── controls/
    ├── Header.tsx         # 상단 헤더 (고정)
    ├── ChannelItem.tsx    # 채팅방 리스트 아이템
    └── EmptyState.tsx     # 빈 상태 UI
```

### 라우팅
```
app/(app)/(tabs)/chat-tab.tsx
 └─ <ChatTabScreen /> 렌더링
```

### 데이터 상태
- DB 조회 로직 제거
- `mockRooms` 배열을 사용하여 FlatList 렌더링
- UI 구조/간격/스크롤/헤더 오버레이 검증 목적

---

## 설계 상 위치
- DB / Sync / WebSocket과 분리된 **순수 UI 단계**
- 이후 단계에서 mock → DB 조회(`channelsTable.findAll`)로 교체 예정

---

## 다음 전환 포인트 (예정)
- ChatTabScreen 내부에서 데이터 소스 교체
  - mockRooms → SQLite 채널 목록
- unreadCount, lastMessage, lastMessageTime를 DB 컬럼/JSON에서 매핑
- Header 액션(검색/추가 등) 실제 기능 연결
