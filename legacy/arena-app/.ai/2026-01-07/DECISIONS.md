# Arena App - 설계 결정 기록

## 2026-01-07

### 1. DB 함수 파라미터 객체 형태로 변경

**배경**
- 파라미터가 여러 개일 때 순서 실수 가능
- `findByChannel(channelId, options, db)` 같은 형태가 헷갈림

**결론**
- 쿼리 관련 파라미터는 객체로 묶음
- `db`는 트랜잭션용 옵셔널이므로 별도 두 번째 파라미터로 분리

```typescript
// 변경 후
await usersTable.findById({ userId }, db);
await messagesTable.findByChannel({ channelId, limit: 50, before: 'msg123' }, db);
await messagesTable.insert({ message, syncStatus: 'pending', tempId: 'temp1' }, db);
```

---

### 2. 스크린 폴더 구조

**배경**
- `app/` 폴더는 Expo Router 라우팅 전용
- 컴포넌트를 어디에 둘지 고민

**결론: screens 폴더 + 2레벨 구조**
```
screens/
  chat-tab/
    Header.tsx           # 1레벨 - 외부에서 import
    ChannelList.tsx      # 1레벨 - 외부에서 import
    controls/            # 2레벨 - 내부 전용
      ChannelItem.tsx
      ChannelAvatar.tsx
```

**원칙**
- `app/`은 라우팅만, 실제 로직은 `screens/`
- 1레벨: 외부에서 직접 import 가능
- 2레벨 (`controls/`): 해당 스크린 내부에서만 사용
- `components/`는 여러 스크린에서 공유하는 진짜 공통만

---

### 3. 컴포넌트 export 규칙

**배경**
- named export vs default export
- index.ts re-export 사용 여부

**결론**
- 파일당 1개 컴포넌트
- `export default function ComponentName()` 스타일
- index.ts로 re-export 하지 않음
- 직접 파일 경로로 import

```typescript
// Good
import Header from "@/screens/chat-tab/Header";

// Bad (index.ts 사용)
import { Header } from "@/screens/chat-tab";
```

---

### 4. 상태 관리 방식 (검토 중)

**현재 결정**
- 일단 `useState`로 시작
- 각 탭에서 필요한 데이터만 로컬로 관리

**나중에 검토**
- zustand: 여러 화면에서 같은 데이터 공유 필요 시
- dbEvents: 실시간 업데이트 필요 시

**보류 사유**
- 메신저는 실시간 앱이라 ReactQuery 캐싱 모델이 안 맞음
- DB가 source of truth, UI는 DB만 바라봄
- 복잡해지면 그때 도입

---

### 5. 동기화 설계 (논의 중)

**초기 동기화**
- 앱 시작 시 서버에서 데이터 fetch → DB 저장
- 트리거 위치: `(app)/_layout.tsx` 유력

**런타임 동기화**
- WebSocket으로 이벤트 수신
- 해당 데이터만 DB에 반영
- 전체 sync 다시 돌지 않음

**구조 (예정)**
```
sync/
  initialSync.ts    # 앱 시작 시 전체 동기화

websocket/
  client.ts         # Socket.IO 연결 관리
  handlers.ts       # 이벤트 → DB 저장
```
