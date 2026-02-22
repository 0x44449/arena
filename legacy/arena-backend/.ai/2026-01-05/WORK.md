# 2026-01-05 작업 내역

## 1. Signal 모듈 리네이밍

### 변경 내용
- `SignalService` → `Signal` (클래스명)
- `signal.service.ts` → `signal.ts` (파일명)

### 이유
- 비즈니스 로직이 아닌 인프라 레이어 (메시지 브로커 어댑터)
- Service 접미사는 비즈니스 서비스에만 사용

### 영향받은 파일
- `src/signal/signal.ts`
- `src/signal/signal.module.ts`
- `src/modules/message/message.service.ts`
- `src/modules/user/user.service.ts`
- `src/modules/gateway/arena.gateway.ts`
- `src/modules/session/session.service.ts`

---

## 2. API 설계 변경: utag → userId 기반

### 변경 내용
| Before | After |
|--------|-------|
| `GET /users/tag/:tag` | `GET /users/:userId` |
| `PATCH /users/tag/:tag` | `PATCH /users/me` |

### 이유
- utag는 배틀태그 스타일 사용자 친화적 ID였으나 조기 최적화
- API 2벌 필요, 변경 시 복잡도 증가
- utag 컬럼은 유지 (나중에 검색 기능용)

### UserService 변경
- `findByUtag()` → `findByUserId()`
- `update(utag, dto)` → `update(userId, dto)`
- `getByUserId()` 추가
- `normalizeUtag()` 제거

---

## 3. Entity 표준화: Soft Delete 지원

### 변경된 Entity

| Entity | 변경 내용 |
|--------|----------|
| MessageEntity | `deletedAt` 추가 |
| ParticipantEntity | `joinedAt` → `createdAt`, `updatedAt`/`deletedAt` 추가 |
| ContactEntity | `updatedAt`/`deletedAt` 추가 |
| ChannelEntity | `deletedAt` 추가 |

### 마이그레이션
- 파일: `src/migrations/1736067600000-AddSoftDeleteColumns.ts`
- 실행 완료

---

## 4. DTO 필드 추가 및 Swagger 정리

### DTO 추가된 필드

| DTO | 추가된 필드 |
|-----|------------|
| UserDto | `userId` |
| ChannelDto | `updatedAt` |
| MessageDto | `seq`, `updatedAt` |
| ContactDto | `updatedAt` |
| FileDto | `updatedAt` |
| ParticipantDto | `updatedAt` |

### Swagger 정리
- 모든 DTO에 `@ApiProperty({ description })` 추가
- 모든 Controller에 `@ApiTags`, `@ApiOperation({ summary })` 통일

---

## 5. 메시지 Sync API 구현

### 목적
앱 백그라운드/네트워크 재연결 시 놓친 변경사항 동기화

### API
```
GET /api/v1/messages/channel/:channelId/sync?since=ISO8601_TIMESTAMP
```

### 응답
```typescript
{
  success: boolean,
  data: {
    created: MessageDto[],      // 새로 생성된 메시지
    updated: MessageDto[],      // 수정된 메시지
    deleted: string[],          // 삭제된 messageId[]
    requireFullSync: boolean    // true면 전체 재조회 필요
  },
  errorCode: string | null
}
```

### 동작
- since 이후 변경된 메시지 조회 (soft delete 포함, `withDeleted()`)
- 100개 초과 시 `requireFullSync: true` 반환
- created/updated/deleted 분류해서 반환

### 관련 파일
- `src/modules/message/dtos/sync-messages-query.dto.ts`
- `src/modules/message/dtos/sync-messages-result.dto.ts`
- `src/modules/message/message.service.ts` - `syncMessages()` 추가
- `src/modules/message/message.controller.ts` - 엔드포인트 추가

---

## 6. File 모듈 리팩토링

### 6.1 Mapper 동기화
- 모든 mapper를 동기 함수로 변경
- S3Service 의존성 제거
- Controller 코드 대폭 간소화

### Before
```typescript
const avatar = message.sender.avatar
  ? await toFileDto(message.sender.avatar, this.s3Service)
  : null;
const senderDto = toUserDto(message.sender, avatar);
messageDtos.push(toMessageDto(message, senderDto));
```

### After
```typescript
messageDtos.push(toMessageDto(message));
// 또는
result.messages.map(toMessageDto)
```

### 6.2 FileDto 변경
- `url` 필드 유지 (서버에서 조립)
- `bucket`, `storageKey` 노출 안 함
- 클라이언트는 `file.url` 그냥 사용

### 6.3 S3Service에 static 메서드 추가
```typescript
static getFileUrl(bucket: string, storageKey: string): string {
  return `${S3Service.S3_BASE_URL}/${bucket}/${storageKey}`;
}
```

### 6.4 환경변수 변경
- `S3_PUBLIC_URL` → `S3_BASE_URL`
- URL 조립: `${S3_BASE_URL}/${bucket}/${storageKey}`

### 6.5 storageKey 구조 변경

| Before | After |
|--------|-------|
| `directory/userId/timestamp.ext` | `userId/directory/fileId` |

- directory는 선택사항 (없으면 `userId/fileId`)
- 파일명: timestamp → nanoid (충돌 방지)
- 확장자 제거 (Content-Type으로 충분)

### 6.6 API 정리

| Method | Endpoint | 설명 |
|--------|----------|------|
| POST | `/files/presigned-url` | 업로드 URL 발급 |
| POST | `/files/register` | 파일 등록 |
| POST | `/files/private/presigned-url` | Private 업로드 URL 발급 |
| POST | `/files/private/register` | Private 파일 등록 |
| GET | `/files/:fileId` | 파일 조회 |
| DELETE | `/files/:fileId` | 파일 삭제 |

- "생성" → "등록" 네이밍 변경 (S3 업로드 후 DB 등록이므로)
- `CreateFileDto` → `RegisterFileDto`
- `createFile()` → `registerFile()`

---

## 7. Private Bucket 논의

### 결론
- 현재는 private bucket 불필요
- 메신저에서 리소스 보안은 API 레벨에서 처리
- URL 자체가 추측 불가능한 nanoid
- 나중에 기업용 기능 추가 시 재검토

---

## 변경된 파일 목록

### 신규 생성
- `src/migrations/1736067600000-AddSoftDeleteColumns.ts`
- `src/modules/message/dtos/sync-messages-query.dto.ts`
- `src/modules/message/dtos/sync-messages-result.dto.ts`

### 이름 변경
- `src/signal/signal.service.ts` → `src/signal/signal.ts`
- `src/modules/file/dtos/create-file.dto.ts` → `src/modules/file/dtos/register-file.dto.ts`

### 수정
- `src/signal/signal.ts` - 클래스명 변경
- `src/signal/signal.module.ts`
- `src/modules/user/user.service.ts` - userId 기반으로 변경
- `src/modules/user/user.controller.ts` - API 경로 변경
- `src/modules/message/message.service.ts` - syncMessages 추가, S3Service 제거
- `src/modules/message/message.controller.ts` - sync 엔드포인트 추가
- `src/modules/message/message.module.ts` - FileModule import 제거
- `src/modules/channel/channel.controller.ts` - mapper 호출 단순화
- `src/modules/contact/contact.controller.ts` - mapper 호출 단순화
- `src/modules/file/file.service.ts` - registerFile로 이름 변경, storageKey 구조 변경
- `src/modules/file/file.controller.ts` - API 정리
- `src/modules/file/s3.service.ts` - static getFileUrl 추가
- `src/modules/gateway/arena.gateway.ts`
- `src/modules/session/session.service.ts`
- `src/entities/message.entity.ts` - deletedAt 추가
- `src/entities/participant.entity.ts` - joinedAt→createdAt, updatedAt/deletedAt 추가
- `src/entities/contact.entity.ts` - updatedAt/deletedAt 추가
- `src/entities/channel.entity.ts` - deletedAt 추가
- `src/dtos/*.ts` - 필드 추가, description 추가
- `src/utils/*.mapper.ts` - 동기 함수로 변경
- `.env` - S3_BASE_URL로 변경
- `.env.template` - S3_BASE_URL로 변경
