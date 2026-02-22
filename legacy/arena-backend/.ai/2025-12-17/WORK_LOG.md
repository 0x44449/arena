# 2025-12-17 작업 내역

## 1. Channel 모듈 구조 변경

### 변경 전
- `DirectChannelController` - DM 전용 컨트롤러
- 타입별로 컨트롤러 분리 예정이었음

### 변경 후
- `ChannelController` - 통합 컨트롤러
- 생성 API만 타입별 분리, 조회 API는 통합
- 서비스는 타입별로 분리 유지 (`DirectChannelService`, `GroupChannelService`)

### API 구조
| Method | Endpoint | 설명 |
|--------|----------|------|
| POST | `/api/v1/channels/direct` | DM 생성 (getOrCreate) |
| POST | `/api/v1/channels/group` | 그룹 생성 |
| GET | `/api/v1/channels` | 내 채널 목록 (통합) |
| GET | `/api/v1/channels/:channelId` | 채널 상세 (통합) |

### 파일 구조
```
src/modules/channel/
├── channel.controller.ts
├── channel.service.ts
├── channel.module.ts
├── direct-channel.service.ts
├── group-channel.service.ts
└── dtos/
    ├── create-direct-channel.dto.ts
    └── create-group-channel.dto.ts
```

---

## 2. Group Channel 엔티티 추가

### 생성된 파일
- `src/entities/group-channel.entity.ts`
- `src/entities/group-participant.entity.ts`

### 테이블 구조
```typescript
GroupChannelEntity {
  channelId: string;
  channel: ChannelEntity;
  iconFileId: string | null;
  icon: FileEntity | null;
}

GroupParticipantEntity {
  channelId: string;
  userId: string;
  participant: ParticipantEntity;
  role: "owner" | "member";
  nickname: string | null;
}
```

---

## 3. Direct Channel - getOrCreate 패턴

### 결정 사항
DM은 `create`가 아닌 `getOrCreate` 패턴 사용

### 이유
- DM은 두 유저 간 항상 최대 1개만 존재하는 특수한 리소스
- "대화 시작" 의도 자체가 "있으면 열고, 없으면 만들어"에 가까움
- 일반적인 create와 달리 idempotent한 동작이 자연스러움

### 코드
```typescript
// DirectChannelService
async getOrCreate(myUserId, targetUserId): Promise<{ channel, participants }>
```

---

## 4. ChannelDto 설계 결정

### 논의 과정
1. 처음: 타입별 다른 정보를 유니온 타입으로 반환 (`ChannelQueryResult`)
2. 고민: 서버가 가공(name, thumbnail)해서 줄지 vs 원본 그대로 줄지
3. 결론: 서버는 데이터 구조에 충실하게 원본 반환

### 최종 ChannelDto 구조
```typescript
interface ChannelDto {
  channelId: string;
  type: "direct" | "group" | "team";
  name: string | null;           // direct는 null
  icon: FileDto | null;          // direct는 null
  participants: ParticipantDto[];
  lastMessageAt: Date | null;
  createdAt: Date;
}

interface ParticipantDto {
  user: UserDto;
  lastReadAt: Date | null;
  joinedAt: Date;
}
```

### 설계 원칙
- 서버는 데이터 구조에 충실하게 반환
- DM: `name: null`, `icon: null`, participants에 양쪽 유저 정보 포함
- Group: `name: "그룹명"`, `icon: FileDto`, participants에 멤버 정보 포함
- 클라이언트가 type 보고 화면 표시 방식 결정

---

## 5. 유니온 타입 제거

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

- 유니온 대신 단일 인터페이스
- 타입별 분기는 서비스 내부에서 처리
- 컨트롤러는 단순하게 DTO 변환만

---

## 6. 생성된/수정된 파일 목록

### 새로 생성
- `src/entities/group-channel.entity.ts`
- `src/entities/group-participant.entity.ts`
- `src/dtos/channel.dto.ts`
- `src/dtos/participant.dto.ts`
- `src/utils/channel.mapper.ts`
- `src/utils/participant.mapper.ts`
- `src/modules/channel/channel.controller.ts`
- `src/modules/channel/channel.service.ts`
- `src/modules/channel/channel.module.ts`
- `src/modules/channel/direct-channel.service.ts`
- `src/modules/channel/group-channel.service.ts`
- `src/modules/channel/dtos/create-direct-channel.dto.ts`
- `src/modules/channel/dtos/create-group-channel.dto.ts`

### 수정
- `src/app.module.ts` - ChannelModule 등록

### 삭제 필요
- `src/modules/direct-channel/` 폴더 전체 (channel로 통합됨)

---

## 7. 다음 작업 예정

### 즉시 해야 할 것
- `src/modules/direct-channel/` 폴더 삭제

### 추후 검토
- participants가 많아지면 Query 패턴 도입 (TODO.md 참고)
- Team 채널 구현
- Message 기능 구현
