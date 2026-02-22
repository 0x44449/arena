# NestJS → Spring Boot Migration Plan

## Overview

Replace `arena-backend/` (NestJS/TypeScript) with `apps/backend/` (Spring Boot/Java 21). The database schema and API contracts remain identical to ensure frontend compatibility.

## Constraints

- **Same database**: Connect to existing PostgreSQL schema (no migration, `ddl-auto: validate`)
- **Same API surface**: Identical endpoints, request/response DTOs, operationIds
- **Same auth**: Supabase JWT (ES256) via JWKS
- **Same error format**: `{ success, errorCode }` envelope
- **Coexistence**: Spring Boot on port 8003, NestJS on 8002 during migration

## Phases

### Phase 0: Project Skeleton ✅
- [x] Gradle project with Spring Boot 3.5, Java 21
- [x] `SecurityConfig` — JWKS JWT validation
- [x] `@CurrentUser` annotation + argument resolver
- [x] Global DTOs (`ApiResult`, `SingleApiResult`, etc.)
- [x] `WellKnownException` + `GlobalExceptionHandler`
- [x] `IdGenerator` (nanoid 12 chars)
- [x] `BaseTimeEntity` (createdAt, updatedAt, deletedAt)
- [x] `SwaggerConfig` (Bearer auth, operationId)
- [x] `application.yml` (DB, Redis, S3, JWT)

### Phase 1: User + Auth
- [ ] `UserEntity` — map to existing `users` table
- [ ] `UserRepository`
- [ ] `UserService` — CRUD + session caching
- [ ] `UserController` — `getMe`, `getUser`, `createUser`, `updateMe`
- [ ] Session caching in Redis (5 min TTL)
- [ ] Verify: Orval generates identical client code

### Phase 2: File
- [ ] `FileEntity` — map to existing `files` table
- [ ] `FileService` — S3 presigned URLs, register, delete
- [ ] `FileController` — public/private upload + register + get + delete
- [ ] S3 client config (LocalStack compatible)

### Phase 3: Channel
- [ ] Entity hierarchy: `ChannelEntity`, `DirectChannelEntity`, `GroupChannelEntity`
- [ ] Participant hierarchy: `ParticipantEntity`, `DirectParticipantEntity`, `GroupParticipantEntity`
- [ ] `ChannelService` — list, get, create direct, create group
- [ ] `ChannelController` — all 4 endpoints

### Phase 4: Message
- [ ] `MessageEntity` — with `(channelId, seq)` index
- [ ] `MessageService` — create (with DB seq), cursor pagination, sync
- [ ] `MessageController` — create, getMessages, syncMessages
- [ ] Seq generation: raw SQL with `COALESCE(MAX(seq), 0) + 1`

### Phase 5: Contact + Device
- [ ] `ContactEntity`, `ContactService`, `ContactController`
- [ ] `DeviceEntity`, `DeviceService`, `DeviceController`

### Phase 6: WebSocket (Gateway)
- [ ] Socket.IO or Spring WebSocket integration
- [ ] Redis Pub/Sub Signal system
- [ ] `channel:join`, `channel:leave`, `message:new` events
- [ ] JWT auth on WebSocket handshake

### Phase 7: Cutover
- [ ] Switch frontend API endpoint from 8002 → 8003
- [ ] Run both servers in parallel, verify identical behavior
- [ ] Remove NestJS server
- [ ] Update Orval config to point to Spring Boot Swagger

## API Compatibility Checklist

| Endpoint | Method | NestJS operationId | Spring operationId | Status |
|----------|--------|--------------------|--------------------|--------|
| `/users` | POST | createUser | createUser | |
| `/users/me` | GET | getMe | getMe | |
| `/users/me` | PATCH | updateMe | updateMe | |
| `/users/:userId` | GET | getUser | getUser | |
| `/channels` | GET | getMyChannels | getMyChannels | |
| `/channels/:channelId` | GET | getChannel | getChannel | |
| `/channels/direct` | POST | createDirectChannel | createDirectChannel | |
| `/channels/group` | POST | createGroupChannel | createGroupChannel | |
| `/messages/channel/:channelId` | POST | createMessage | createMessage | |
| `/messages/channel/:channelId` | GET | getMessages | getMessages | |
| `/messages/channel/:channelId/sync` | GET | syncMessages | syncMessages | |
| `/contacts` | GET | getContacts | getContacts | |
| `/contacts` | POST | createContact | createContact | |
| `/contacts/:userId` | DELETE | deleteContact | deleteContact | |
| `/files/presigned-url` | POST | getPresignedUrl | getPresignedUrl | |
| `/files/register` | POST | registerFile | registerFile | |
| `/files/private/presigned-url` | POST | getPrivatePresignedUrl | getPrivatePresignedUrl | |
| `/files/private/register` | POST | registerPrivateFile | registerPrivateFile | |
| `/files/:fileId` | GET | getFile | getFile | |
| `/files/:fileId` | DELETE | deleteFile | deleteFile | |
| `/devices/register` | POST | registerDevice | registerDevice | |
| `/devices/unregister` | POST | unregisterDevice | unregisterDevice | |

## JPA Column Mapping Notes

Existing TypeORM schema uses camelCase column names with double quoting:
```sql
"channelId", "lastMessageAt", "createdAt", "deletedAt"
```

Spring Boot configuration to match:
```yaml
jpa:
  hibernate:
    naming:
      physical-strategy: org.hibernate.boot.model.naming.PhysicalNamingStrategyStandardImpl
  properties:
    hibernate:
      globally_quoted_identifiers: true
```

Entity column annotations:
```java
@Column(name = "channelId")     // matches TypeORM's "channelId"
@Column(name = "lastMessageAt") // matches TypeORM's "lastMessageAt"
```
