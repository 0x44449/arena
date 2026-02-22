# Arena App - 설계 결정 기록

## 2026-01-08

### 1. chat-tab을 "UI 목업 단계"로 분리

**배경**
- DB/동기화 로직이 아직 미완성 상태에서 화면 레이아웃/경험을 먼저 확정할 필요
- 리스트/헤더/아이템 UI가 안정되면 이후 데이터 소스(DB/Sync) 교체가 쉬움

**결론**
- chat-tab은 우선 mock 데이터로 구성
- 데이터 소스는 이후 `channelsTable.findAll()` 기반으로 교체

---

### 2. chat-tab 엔트리 컴포넌트 단일화

**배경**
- 라우트(`app/`)는 라우팅만 담당
- 화면 로직은 `screens/`에 모으는 규칙 유지

**결론**
- `app/(app)/(tabs)/chat-tab.tsx`는 `ChatTabScreen`만 렌더링
- chat-tab의 메인 화면은 `screens/chat-tab/ChatTabScreen.tsx`로 통일

---

### 3. 내부 전용 UI는 controls/로 배치

**배경**
- screens 2레벨(내부 전용) 규칙 유지

**결론**
- `screens/chat-tab/controls/*`로 채팅탭 전용 컴포넌트 배치
  - Header
  - ChannelItem
  - EmptyState
