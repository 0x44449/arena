# Arena App - 프로젝트 현황 (2026-01-14 기준)

## 아키텍처 변경

### Offline 우선 구조로 전환
기존 `db/` 폴더를 `offline/` 아래로 이동하고 Flux 패턴 적용

```
offline/
├── actions/         # UI 인터페이스
├── engines/         # 비즈니스 로직
└── db/
    ├── schema/      # 테이블 정의
    └── queries/     # DB CRUD
```

### 데이터 흐름
```
UI → Action (dispatch)
       ↓
    Engine (reducer)
       ↓
    API + DB + Event
       ↓
    UI 자동 업데이트 (이벤트 구독)
```

---

## DB 레이어 정리

### 변경 사항
- `procedures` → `queries`
- 복수형 → 단수형 객체명
  - `channelsQueries` → `channelsQuery`
  - `messagesQueries` → `messagesQuery`

### 구조
```
offline/db/
├── schema/
│   ├── channels.ts      # tableName, cols, types, parseRow
│   └── ...
├── queries/
│   ├── channels-query.ts    # findAll, upsert 등
│   └── ...
├── database.ts
└── index.ts
```

---

## 현재 구현 상태

### ✅ 완성
- DB 스키마 및 CRUD (모든 테이블)
- Offline 폴더 구조
- Action/Engine 뼈대

### 🚧 진행 중
- 이벤트 시스템 설계 (미결정)

### ❌ 미구현
- Action/Engine 실제 구현
- 서버 동기화 로직
- WebSocket 연결
- UI와 Offline 레이어 연결
- 이벤트 구독 Hook (`useChannels` 등)

---

## 다음 작업

1. **이벤트 시스템 결정**
   - EventEmitter vs React Query vs 기타
   - 세밀도 결정 (테이블 단위 vs 아이템 단위)

2. **channels-engine 구현**
   - `initialize()`: 앱 시작 시 서버에서 채널 목록 가져오기
   - `add()`: 채널 생성
   - DB 업데이트 후 이벤트 발생

3. **useChannels Hook 구현**
   - DB 구독
   - 이벤트 감지 시 재조회

4. **ChatTabScreen 연결**
   - Mock 데이터 제거
   - `useChannels()` 사용
   - `channelsAction` 호출

---

## 설계 원칙

### UI 레이어
- 동기화 로직을 알 필요 없음
- Action만 호출
- DB 내용을 읽어서 표시만

### Offline 레이어
- SQLite가 Single Source of Truth
- Engine이 모든 비즈니스 로직 처리
- 변경 시 이벤트 발생으로 UI 자동 업데이트

### 데이터 동기화
- 앱 시작 시: `engine.initialize()`
- 사용자 액션: `action.xxx()` → `engine.xxx()`
- 백그라운드: 자동 동기화 (WebSocket 또는 폴링)
