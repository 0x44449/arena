# Arena App - 설계 결정 기록

## 2026-01-15

### 1. 오프라인 아키텍처 보류

**배경**
- 이벤트 시스템, Engine/Action 레이어 설계 중이었음
- 클라이언트 작업이 오래 걸려서 서버 아키텍처에 손을 못 대는 상황

**결정**
- 오프라인 아키텍처 일단 보류
- React Query로 서버 직접 호출하여 빠르게 MVP 완성
- 나중에 필요하면 오프라인 레이어 추가

**이유**
- 빠르게 동작하는 앱 만들고 서버 작업으로 넘어가야 함
- 실시간 동기화 등 서버 아키텍처가 더 중요

---

### 2. API 코드 생성 - Orval 유지

**검토한 옵션**
- openapi-typescript-codegen: 파일명 케밥케이스 불가
- swagger-typescript-api
- Orval + operationId

**결정**
- Orval 유지
- 서버 컨트롤러에 operationId 명시

**이유**
- React Query 훅 자동 생성이 편함
- operationId만 달면 함수명 깔끔해짐

---

### 3. 메시지 seq 채번 - DB 서브쿼리

**검토한 옵션**
1. Redis incr - O(1)이지만 싱크 관리 필요
2. DB 트랜잭션 락 - ORM으로 깔끔하지만 2단계 조회
3. DB 서브쿼리 - raw query지만 atomic
4. Stored Procedure - DB에 로직 숨김

**결정**
- DB 서브쿼리 방식 채택

```sql
INSERT INTO messages (..., seq, ...)
VALUES (..., (SELECT COALESCE(MAX(seq), 0) + 1 FROM messages WHERE channelId = $1), ...)
```

**이유**
- Redis 싱크 신경 쓸 필요 없음
- DB 직접 수정해도 문제 없음
- 성능 차이 ms 단위로 체감 불가
- 인덱스 있으면 MAX 조회 빠름

**기술 부채**
- raw query에 컬럼명 하드코딩
- 추후 stored procedure로 개선 가능

---

### 4. 대화방 UI - 단순한 구조로

**기존**
- LegendList
- BlurView 헤더/입력창
- KeyboardStickyView

**변경**
- FlatList + inverted
- 일반 View 헤더/입력창
- KeyboardAvoidingView

**이유**
- 빠른 구현 우선
- 복잡한 키보드 처리는 나중에 개선
