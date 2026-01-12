# 2026-01-12 작업 내역

## 1. chat-room 리스트 구성 변경 (키보드/스크롤 테스트)

### 변경 내용
- `FlatList` → `LegendList`로 변경
- 키보드 표시 시 스크롤 유지 검증을 위해 옵션 추가
  - `estimatedItemSize`
  - `alignItemsAtEnd`
  - `maintainVisibleContentPosition`
  - 헤더/푸터 spacer 추가

### 대상 파일
- `screens/chat-room/ChatRoomScreen.tsx`

---

## 2. 메시지 입력창 구성 조정

### 변경 내용
- 입력창 컨테이너를 `KeyboardStickyView` 대신 일반 `View`로 구성
- 하단 여백/정렬용 스타일 값을 조정

### 대상 파일
- `screens/chat-room/controls/MessageInput.tsx`

---

## 3. 의존성 추가

### 변경 내용
- `@legendapp/list` 추가

### 대상 파일
- `package.json`
- `package-lock.json`
