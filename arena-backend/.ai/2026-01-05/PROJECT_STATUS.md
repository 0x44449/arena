# Arena Backend - 프로젝트 현황 (2026-01-05 기준)

## 기술 스택
- **Framework**: NestJS
- **Database**: PostgreSQL + TypeORM
- **Cache**: Redis (세션, Pub/Sub, 시퀀스 채번)
- **Storage**: S3 (LocalStack for dev)
- **Auth**: Supabase JWT (ES256, JWKS)
- **WebSocket**: Socket.IO + Redis Pub/Sub

---

## 프로젝트 구조

```
src/
├── app.module.ts
├── main.ts
│
├── decorators/
│   ├── current-user.decorator.ts    # @CurrentUser() → CachedUser
│   └── jwt-payload.decorator.ts     # @JwtPayloadParam() → JwtPayload
│
├── dtos/                            # 공용 DTO
│   ├── api-result.dto.ts
│   ├── single-api-result.dto.ts
│   ├── list-api-result.dto.ts
│   ├── infinity-list-api-result.dto.ts
│   ├── user.dto.ts
│   ├── channel.dto.ts
│   ├── message.dto.ts
│   ├── contact.dto.ts
│   ├── file.dto.ts
│   └── participant.dto.ts
│
├── entities/
│   ├── user.entity.ts
│   ├── file.entity.ts
│   ├── channel.entity.ts
│   ├── participant.entity.ts
│   ├── direct-channel.entity.ts
│   ├── direct-participant.entity.ts
│   ├── group-channel.entity.ts
│   ├── group-participant.entity.ts
│   ├── message.entity.ts
│   ├── contact.entity.ts
│   └── device.entity.ts
│
├── exceptions/
│   └── well-known-exception.ts
│
├── guards/
│   ├── arena-jwt-auth-guard.ts      # HTTP JWT 검증
│   └── ws-jwt-auth.guard.ts         # WebSocket JWT 검증
│
├── migrations/
│   ├── 1767267828918-Init.ts
│   └── 1736067600000-AddSoftDeleteColumns.ts
│
├── modules/
│   ├── user/
│   ├── channel/
│   ├── message/
│   ├── contact/
│   ├── file/
│   ├── device/
│   ├── session/                     # 유저 캐싱 (Redis, 5분 TTL)
│   └── gateway/                     # WebSocket Gateway
│
├── redis/
│   ├── redis.module.ts              # Global 모듈
│   └── redis.constants.ts           # REDIS_CLIENT, REDIS_SUBSCRIBER
│
├── seeds/                           # 테스트 데이터
│   ├── seed.ts
│   └── data/
│
├── signal/                          # Pub/Sub 추상화
│   ├── signal.module.ts
│   ├── signal.ts
│   └── signal.channels.ts
│
├── types/
│   └── jwt-payload.interface.ts
│
└── utils/
    ├── id-generator.ts              # nanoid(12)
    ├── user.mapper.ts
    ├── channel.mapper.ts
    ├── message.mapper.ts
    ├── contact.mapper.ts
    ├── file.mapper.ts
    └── participant.mapper.ts
```

---

## API 전체 목록

### User
| Method | Endpoint | 설명 | Guard |
|--------|----------|------|-------|
| GET | `/api/v1/users/me` | 내 정보 조회 | JWT |
| GET | `/api/v1/users/:userId` | 유저 조회 | JWT + Session |
| PATCH | `/api/v1/users/me` | 내 정보 수정 | JWT + Session |
| POST | `/api/v1/users` | 회원가입 | JWT |

### Channel
| Method | Endpoint | 설명 | Guard |
|--------|----------|------|-------|
| GET | `/api/v1/channels` | 내 채널 목록 | JWT + Session |
| GET | `/api/v1/channels/:channelId` | 채널 상세 | JWT + Session |
| POST | `/api/v1/channels/direct` | DM 생성 | JWT + Session |
| POST | `/api/v1/channels/group` | 그룹 생성 | JWT + Session |

### Message
| Method | Endpoint | 설명 | Guard |
|--------|----------|------|-------|
| GET | `/api/v1/messages/channel/:channelId` | 메시지 목록 (cursor) | JWT + Session |
| GET | `/api/v1/messages/channel/:channelId/sync` | 메시지 동기화 | JWT + Session |
| POST | `/api/v1/messages/channel/:channelId` | 메시지 전송 | JWT + Session |

### Contact
| Method | Endpoint | 설명 | Guard |
|--------|----------|------|-------|
| GET | `/api/v1/contacts` | 연락처 목록 | JWT + Session |
| POST | `/api/v1/contacts` | 연락처 추가 | JWT + Session |
| DELETE | `/api/v1/contacts/:userId` | 연락처 삭제 | JWT + Session |

### File
| Method | Endpoint | 설명 | Guard |
|--------|----------|------|-------|
| POST | `/api/v1/files/presigned-url` | 업로드 URL 발급 | JWT + Session |
| POST | `/api/v1/files/register` | 파일 등록 | JWT + Session |
| POST | `/api/v1/files/private/presigned-url` | Private 업로드 URL | JWT + Session |
| POST | `/api/v1/files/private/register` | Private 파일 등록 | JWT + Session |
| GET | `/api/v1/files/:fileId` | 파일 조회 | JWT + Session |
| DELETE | `/api/v1/files/:fileId` | 파일 삭제 | JWT + Session |

### Device
| Method | Endpoint | 설명 | Guard |
|--------|----------|------|-------|
| POST | `/api/v1/devices/register` | 디바이스 등록 | JWT + Session |
| POST | `/api/v1/devices/unregister` | 디바이스 해제 | JWT + Session |

---

## WebSocket

### 연결 정보
- 경로: `/ws`
- 네임스페이스: `/arena`
- 인증: `auth.token`에 JWT

```typescript
const socket = io("http://localhost:8002/arena", {
  path: "/ws",
  auth: { token: "Bearer xxx" }
});
```

### 이벤트
| 이벤트 | 방향 | 페이로드 | 설명 |
|--------|------|----------|------|
| `channel:join` | C→S | `{ channelId }` | 채널 Room 입장 |
| `channel:leave` | C→S | `{ channelId }` | 채널 Room 퇴장 |
| `message:new` | S→C | `{ channelId, message }` | 새 메시지 |

---

## 주요 설계 결정

### ID 생성
- `nanoid(12)` 사용 (알파벳: `0-9a-z`)
- URL 친화적, UUID보다 짧음

### 채널 구조
- 공통 테이블 (`channels`, `participants`) + 확장 테이블 (`direct_*`, `group_*`)
- 타입: `direct`, `group`, `team` (team은 미구현)

### 메시지 순번 (seq)
- Redis INCR로 채번 (`channel:{channelId}:seq`)
- cursor pagination에 사용

### 파일 업로드 플로우
1. `POST /files/presigned-url` → `{ uploadUrl, key }`
2. 클라이언트가 S3에 직접 업로드
3. `POST /files/register` → `FileDto`

### Soft Delete
- `deletedAt` 컬럼 사용
- Sync API에서 `withDeleted()`로 삭제된 항목도 조회

### 세션 캐싱
- Redis에 유저 정보 캐싱 (5분 TTL)
- 키: `session:{uid}`
- 유저 정보 변경 시 Signal로 무효화

---

## 환경변수 (.env)

```env
# Database
DB_HOST=localhost
DB_PORT=15432
DB_USER=postgres
DB_PASSWORD=xxx
DB_NAME=arena

# Redis
REDIS_HOST=localhost
REDIS_PORT=16379

# S3
S3_BASE_URL=http://localhost:14566
S3_PUBLIC_BUCKET=arena-files-public
S3_PRIVATE_BUCKET=arena-files-private
AWS_REGION=us-east-1
AWS_ENDPOINT=http://localhost:14566
AWS_ACCESS_KEY_ID=test
AWS_SECRET_ACCESS_KEY=test

# Supabase
SUPABASE_JWKS_URI=https://xxx.supabase.co/auth/v1/.well-known/jwks.json

# Server
SERVER_URL=http://localhost:8002
```

---

## 테스트 데이터 (Seeder)

```bash
npm run seed
```

- 유저 3명 (SEED_USER_1, 2, 3 환경변수에서 로드)
- DM 채널 1개 (유저1 ↔ 유저2)
- 그룹 채널 1개 (전원 참여)
- 메시지 약 40개
