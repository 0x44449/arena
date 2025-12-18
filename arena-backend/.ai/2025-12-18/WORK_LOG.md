# 2025-12-18 작업 내역

## 1. Channel 모듈 리팩토링

### 공통 함수 인라인화
CODING_RULES에 따라 private 헬퍼 함수들을 인라인화:
- `getUserIdFromJwt` → 각 메서드에서 직접 처리
- `toParticipantDtos` → 각 메서드에서 직접 처리
- `toChannelDtoFromDetails` → 각 메서드에서 직접 처리
- 서비스의 `getChannelDetails`, `addParticipant`, `getParticipants` 등도 인라인화

### API 응답 형식 통일
- `ChannelDto` 직접 반환 → `SingleApiResultDto<ChannelDto>`, `ListApiResultDto<ChannelDto>`로 변경
- 다른 컨트롤러들과 응답 형식 통일

---

## 2. Message 모듈 신규 구현

### 엔티티
```typescript
MessageEntity {
  messageId: string (PK)
  channelId: string (indexed)
  senderId: string
  seq: bigint           // Redis INCR로 채번
  content: string
  createdAt: Date
  updatedAt: Date
}
```
- 복합 인덱스: `idx_messages_channel_seq` (channelId, seq)

### API
| Method | Endpoint | 설명 |
|--------|----------|------|
| POST | `/api/v1/messages/channel/:channelId` | 메시지 보내기 |
| GET | `/api/v1/messages/channel/:channelId` | 메시지 목록 조회 |

### 메시지 조회 (Discord 스타일 커서)
| 파라미터 | 동작 |
|----------|------|
| 없음 | 최신 메시지 limit개 |
| `before` | 해당 메시지 이전 limit개 |
| `after` | 해당 메시지 이후 limit개 |
| `around` | 해당 메시지 중심 앞뒤 limit/2개씩 |

### InfinityListApiResultDto
무한스크롤용 응답 DTO 추가:
```typescript
{
  success: boolean
  errorCode: string | null
  data: T[]
  hasNext: boolean
  hasPrev: boolean
}
```

### 라우팅 설계 결정
- `/api/v1/channels/:channelId/messages` (RESTful) vs `/api/v1/messages?channelId=xxx` (flat) 고민
- 최종: `/api/v1/messages/channel/:channelId`
  - 컨트롤러 base path 룰 유지 (`@Controller("/api/v1/messages")`)
  - channelId가 경로에 있어 종속성 명확
  - 나중에 `/api/v1/messages/:messageId` 추가해도 충돌 없음

---

## 3. Contact 모듈 신규 구현

### 설계 결정
- 양방향 친구(요청/수락) 대신 일방적 연락처 방식 채택
- 내가 추가하면 내 목록에 바로 표시
- 카카오톡, 텔레그램 방식과 유사

### 엔티티
```typescript
ContactEntity {
  ownerId: string (PK)  // 연락처를 소유한 사람
  userId: string (PK)   // 연락처에 저장된 사람
  createdAt: Date
}
```
- `userId`가 주체 (저장된 사람)
- `ownerId`는 "누구 목록인지"

### API
| Method | Endpoint | 설명 |
|--------|----------|------|
| GET | `/api/v1/contacts` | 내 연락처 목록 |
| POST | `/api/v1/contacts` | 연락처 추가 |
| DELETE | `/api/v1/contacts/:userId` | 연락처 삭제 |

---

## 4. Seeder 구조화

### 파일 구조
```
src/seeds/
├── seed.ts              # 메인 실행 파일
└── data/
    ├── users.seed.ts    # 유저 데이터
    ├── channels.seed.ts # 채널 데이터
    └── messages.seed.ts # 메시지 데이터
```

### 실행
```bash
npx ts-node src/seeds/seed.ts
```

---

## 5. 생성된 파일 목록

### 엔티티
- `src/entities/message.entity.ts`
- `src/entities/contact.entity.ts`

### DTO
- `src/dtos/message.dto.ts`
- `src/dtos/contact.dto.ts`
- `src/dtos/infinity-list-api-result.dto.ts`

### Mapper
- `src/utils/message.mapper.ts`
- `src/utils/contact.mapper.ts`

### Message 모듈
- `src/modules/message/message.controller.ts`
- `src/modules/message/message.service.ts`
- `src/modules/message/message.module.ts`
- `src/modules/message/dtos/create-message.dto.ts`
- `src/modules/message/dtos/get-messages-query.dto.ts`
- `src/modules/message/dtos/get-messages-result.dto.ts`

### Contact 모듈
- `src/modules/contact/contact.controller.ts`
- `src/modules/contact/contact.service.ts`
- `src/modules/contact/contact.module.ts`
- `src/modules/contact/dtos/create-contact.dto.ts`

### Seeder
- `src/seeds/seed.ts`
- `src/seeds/data/users.seed.ts`
- `src/seeds/data/channels.seed.ts`
- `src/seeds/data/messages.seed.ts`

---

## 6. 다음 작업 예정

- [ ] Seeder에 Contact 데이터 추가
- [ ] DB 마이그레이션 생성 및 실행
- [ ] 클라이언트에서 메시지 보내기 테스트
