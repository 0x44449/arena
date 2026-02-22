# Arena Backend - 설계 결정 기록 (2025-12-17)

## 컨트롤러 통합 vs 분리

### 결정
- 컨트롤러: 통합 (`ChannelController`)
- 서비스: 타입별 분리 (`DirectChannelService`, `GroupChannelService`)

### 이유
- 클라이언트 입장에서 채널은 하나의 리소스
- 생성 API만 타입별로 다른 body가 필요해서 엔드포인트 분리
- 조회 API는 통합된 `ChannelDto`로 응답

### 구조
```
POST /channels/direct  → DirectChannelService
POST /channels/group   → GroupChannelService
GET  /channels         → ChannelService (통합 조회)
GET  /channels/:id     → ChannelService (통합 조회)
```

---

## 생성 API - 엔드포인트 분리 vs body에 type

### 결정
엔드포인트 분리 방식 채택

### 대안들
1. **엔드포인트 분리** (채택)
   - `POST /channels/direct { userId }`
   - `POST /channels/group { name, userIds }`
   
2. **단일 엔드포인트 + type 분기**
   - `POST /channels { type: 'direct', userId }`
   - `POST /channels { type: 'group', name, userIds }`

### 이유
- 타입별로 필수 필드가 확실히 다름
- DTO가 명확하게 분리됨
- union 타입이나 optional 필드 범벅 방지
- Swagger 문서화가 깔끔함

---

## DM - getOrCreate 패턴

### 결정
DM 생성 API는 `getOrCreate` 패턴 사용

### 이유
- DM은 두 유저 간 항상 최대 1개만 존재
- "대화 시작" 의도 = "있으면 열고, 없으면 만들어"
- 클라이언트가 매번 조회 → 없으면 생성 하는 건 번거로움
- 카카오톡, 디스코드도 이 방식

### 코드 주석으로 기록
```typescript
/**
 * DM 채널 가져오기 (없으면 생성)
 *
 * DM은 두 유저 간 항상 최대 1개만 존재하는 특수한 리소스.
 * "대화 시작" 의도 자체가 "있으면 열고, 없으면 만들어"에 가깝기 때문에
 * 일반적인 create와 달리 getOrCreate 패턴을 사용한다.
 */
```

---

## ChannelDto - 서버 가공 vs 원본 반환

### 결정
서버는 데이터 구조에 충실하게 원본 반환

### 논의 과정
1. 처음: 서버가 `name`, `thumbnail`을 가공해서 통일된 형태로 반환
2. 의문: 서버가 "화면에 어떻게 보여줄지"를 결정하는 게 맞나?
3. 결론: 원본 그대로 주고, 클라이언트가 type 보고 처리

### 최종 구조
```typescript
// DM 응답 예시
{
  type: "direct",
  name: null,        // 원본 그대로 (DM은 name 없음)
  icon: null,        // 원본 그대로 (DM은 icon 없음)
  participants: [...]  // 상대방 정보는 여기서 가져감
}

// Group 응답 예시
{
  type: "group",
  name: "그룹명",
  icon: { ... },
  participants: [...]
}
```

---

## participants 전체 반환

### 결정
일단 participants 전체를 항상 반환

### 우려
- 그룹 멤버 100명이면 목록 조회마다 전체 내려주는 게 부담

### 대응
- 당장은 문제 없음 (DM은 2명, 그룹도 아직 대규모 아님)
- 나중에 필요하면 Query 패턴 도입 (TODO에 기록)

---

## 유니온 타입 제거

### 변경 전
```typescript
type ChannelQueryResult =
  | { channel; type: "direct"; otherUser: UserEntity }
  | { channel; type: "group"; groupChannel: GroupChannelEntity };
```

### 변경 후
```typescript
interface ChannelWithDetails {
  channel: ChannelEntity;
  participants: ParticipantEntity[];
  groupChannel: GroupChannelEntity | null;
}
```

### 이유
- 유니온 타입은 컨트롤러에서 분기 필요
- 타입 늘어날수록 복잡해짐
- 단일 인터페이스로 통일하고, 타입별 차이는 nullable 필드로 표현
