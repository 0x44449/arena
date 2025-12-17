# Arena Backend - 코딩 컨벤션

## 네이밍

### 파일명
- **kebab-case** 사용
- 예: `direct-channel.controller.ts`, `create-user.dto.ts`

### 변수/함수
- **camelCase** 사용
- 예: `channelId`, `createDirectChannel`

### 클래스
- **PascalCase** 사용
- 예: `DirectChannelService`, `UserEntity`

---

## ID 생성
- `nanoid(12)` 사용
- 숫자 + 대소문자 (URL-safe)
- `src/utils/id-generator.ts`의 `generateId()` 사용

---

## DTO

### Request DTO
- 모듈 내 `dtos/` 폴더에 위치
- 파일별로 분리: `create-xxx.dto.ts`, `update-xxx.dto.ts`
- `class-validator` 데코레이터 사용

### Response DTO
- `src/dtos/`에 공통 위치
- `xxx.dto.ts` 형태
- 서버 구현 디테일 숨김 (예: S3 key 대신 presigned URL)

---

## Mapper
- `src/utils/xxx.mapper.ts`에 위치
- **순수 함수**로 유지 (DI 없음)
- 비동기 작업은 controller에서 처리 후 mapper에 전달

```typescript
// Good
export function toUserDto(entity: UserEntity, avatar: FileDto | null): UserDto

// Bad - mapper에서 비동기 처리
export async function toUserDto(entity: UserEntity, s3Service: S3Service): Promise<UserDto>
```

---

## API 설계

### 엔드포인트
- `POST` - 생성 (별도 DTO 파일)
- `GET` - 조회
- `PATCH` - 부분 수정
- `DELETE` - 삭제

### 경로
- kebab-case: `/api/v1/direct-channels`
- 복수형 리소스명: `channels`, `users`

---

## 에러 처리
- `WellKnownException` 사용
- `errorCode`는 UPPER_SNAKE_CASE
- 예: `USER_NOT_FOUND`, `INVALID_DM_TARGET`

---

## 기타
- 추상화보다 명시적 데이터 흐름 선호
- 오버엔지니어링 지양 (필요할 때 리팩토링)
- 개인 프로젝트 특성상 빠른 개발 우선
