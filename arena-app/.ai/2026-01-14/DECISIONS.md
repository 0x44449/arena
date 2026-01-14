# Arena App - 설계 결정 기록

## 2026-01-14

### 1. DB 레이어를 schema와 queries로 분리

**배경**
- 기존 코드는 스키마 정의와 쿼리 로직이 한 파일에 섞여 있음
- 역할이 명확하지 않아 유지보수 어려움

**결정**
- `schema/`: 테이블명, 컬럼, 타입, 파싱 헬퍼만
- `queries/`: 실제 쿼리 함수만

**결과**
- 관심사 분리로 가독성 향상
- 스키마 변경 시 schema만, 쿼리 변경 시 queries만 수정

---

### 2. procedures → queries 네이밍 변경

**배경**
- `procedures`는 SQL stored procedure를 연상시킴
- 실제로는 단순 쿼리 함수 모음

**결정**
- `queries`로 변경
- 객체명도 복수형에서 단수형으로: `channelsQuery`

**이유**
- 더 직관적
- 함수 모음이라는 의미가 명확

---

### 3. Offline 아키텍처 - Flux 패턴 적용

**배경**
- UI에서 API, DB를 직접 호출하면 코드가 복잡해짐
- Redux/Flux 패턴으로 관심사 분리 필요

**결정**
```
offline/
├── actions/     # UI 인터페이스
├── engines/     # 비즈니스 로직
└── db/          # 데이터 레이어
```

**흐름**
```
UI → Action → Engine → API + DB + Event → UI 재렌더링
```

**레이어 역할**
- Action: UI가 호출하는 public API (dispatch)
- Engine: Reducer처럼 실제 로직 처리
- Query: DB CRUD

**원칙**
- UI는 Action만 호출, Engine/Query 구현을 몰라도 됨
- Engine이 모든 변경을 처리하고 이벤트 발생
- UI는 이벤트 구독으로 자동 업데이트

---

### 4. 이벤트 시스템 (미결정)

**배경**
- DB 변경을 UI에 통지하는 메커니즘 필요
- 여러 옵션 검토 중

**논의된 옵션**
1. EventEmitter: 간단하지만 이벤트 종류 많아짐
2. React Query: 익숙하지만 SQLite용으로는 misuse
3. 테이블 기반: 간단하지만 세밀한 제어 불가

**핵심 이슈**
- 전체 목록 vs 특정 아이템 업데이트
- 채널 한 개 수정 시 전체 목록 재조회는 비효율

**결정 보류**
- 다음 작업 시 실제 구현하면서 결정

---

### 5. SQLite를 Single Source of Truth로

**배경**
- 오프라인 우선 아키텍처
- 서버는 동기화 대상일 뿐

**결정**
- UI는 항상 SQLite에서 읽음
- 서버 데이터는 백그라운드로 SQLite에 동기화
- React Query 같은 서버 상태 관리는 사용 안 함

**이유**
- 오프라인에서도 작동
- 네트워크 지연 없는 빠른 UI
- 서버 동기화는 Engine이 투명하게 처리
