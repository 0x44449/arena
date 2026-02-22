# 2026-01-01 작업 내역

## 1. Seeder 수정 - 실제 Supabase 유저 연결

### 변경 내용
기존 하드코딩된 더미 유저 대신 `.env`에서 시드 데이터 로드

```typescript
// users.seed.ts - 환경 변수에서 읽어옴
function loadSeedUsers(): SeedUser[] {
  const users: SeedUser[] = [];
  for (let i = 1; i <= 10; i++) {
    const user = parseSeedUser(process.env[`SEED_USER_${i}`]);
    if (user) users.push(user);
  }
  return users;
}
```

```bash
# .env
SEED_USER_1=uid,email,nick,utag
SEED_USER_2=uid,email,nick,utag
SEED_USER_3=uid,email,nick,utag
```

### 생성된 테스트 데이터
- DM 채널: Zina ↔ 테스터1 (메시지 5개)
- 그룹 채널: 3명 전원 참여 (메시지 38개)

---

## 2. JWT 인증 방식 변경 - HS256 → ES256 (JWKS)

### 배경
- Supabase에서 HS256(Legacy)과 ES256(ECC P-256) 두 가지 지원
- ES256이 더 안전 (비대칭키, 공개키만으로 검증)
- 키 로테이션 시 서버 재배포 불필요

### 변경 내용

**패키지 추가**
```bash
npm install jwks-rsa
```

**jwt-strategy.ts 수정**
```typescript
import { passportJwtSecret } from "jwks-rsa";

super({
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  ignoreExpiration: false,
  secretOrKeyProvider: passportJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri,  // Supabase JWKS 엔드포인트
  }),
  algorithms: ["ES256"],
});
```

**.env 변경**
```bash
# 기존
JWT_SECRET=xxx

# 변경
SUPABASE_JWKS_URI=https://<project-ref>.supabase.co/auth/v1/.well-known/jwks.json
```

### Supabase 설정
- Settings > JWT Keys > "Rotate keys" 실행
- ECC (P-256) 키가 Current로 변경됨
- 이후 발급되는 토큰은 ES256으로 서명

---

## 3. GlobalExceptionFilter 개선

### 변경 내용
기존: 모든 응답을 200으로 내림
변경: HttpException 계열은 적절한 status code 반환

```typescript
if (exception instanceof WellKnownException) {
  errorCode = exception.errorCode ?? "UNKNOWN_ERROR";
} else if (exception instanceof HttpException) {
  statusCode = exception.getStatus();
  errorCode = this.httpStatusToErrorCode(statusCode);
} else {
  statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
}
```

### 에러 코드 매핑
| Status | Error Code |
|--------|------------|
| 401 | UNAUTHORIZED |
| 403 | FORBIDDEN |
| 404 | NOT_FOUND |
| 400 | BAD_REQUEST |
| 409 | CONFLICT |

---

## 4. Swagger 설정 수정

### 문제
orval에서 스키마 검증 오류 발생
```
#/components/securitySchemes/bearer must NOT have additional properties
```

### 원인
`addBearerAuth`에 불필요한 옵션 (`name`, `in`)이 포함되어 있었음

### 수정
```typescript
// 기존
.addBearerAuth({
  type: 'http',
  scheme: 'bearer',
  bearerFormat: 'JWT',
  name: 'Authorization',      // 불필요
  description: 'Enter your JWT token',
  in: 'header',               // 불필요
}, 'bearer')

// 수정
.addBearerAuth({
  type: 'http',
  scheme: 'bearer',
  bearerFormat: 'JWT',
  description: 'Enter your JWT token',
}, 'bearer')
```

---

## 5. 기타 수정

### data-source.ts - export 중복 제거
TypeORM migration 생성 시 오류 해결
```typescript
// 기존: export가 2개
export const AppDataSource = new DataSource(...)
export default AppDataSource;

// 수정: default export만
const AppDataSource = new DataSource(...)
export default AppDataSource;
```

### seed.ts - FileEntity 누락 수정
UserEntity가 FileEntity를 참조하는데 entities에 누락되어 있었음

---

## 6. 클라이언트 상태 관리 논의

### 논의 내용
- React Query vs Zustand 비교
- 메신저에서 React Query의 한계 (캐시키 지옥, 정규화 어려움)
- 정규화된 스토어의 장점 (한 곳만 업데이트하면 끝)
- immer로 immutable 업데이트 단순화

### 결론
아직 미정. 실제로 클라이언트 개발하면서 결정하기로 함.

### 고려 중인 옵션
1. **Zustand + immer** - 단순, 정규화 쉬움
2. **React Query + 정규화 스토어** - fetch 편의성 + 정규화
3. **직접 구현** - 경량화된 fetch 훅 + Zustand

---

## 변경된 파일 목록

- `src/seeds/data/users.seed.ts` - Supabase 유저 UUID 연결
- `src/seeds/data/channels.seed.ts` - 3명 기준으로 수정
- `src/seeds/data/messages.seed.ts` - 3명 기준으로 수정
- `src/seeds/seed.ts` - FileEntity 추가
- `src/auth/jwt-strategy.ts` - JWKS 방식으로 변경
- `src/filters/global-exception.filter.ts` - HTTP 상태 코드 분리
- `src/database/data-source.ts` - export 중복 제거
- `src/main.ts` - Swagger addBearerAuth 수정
- `.env` - SUPABASE_JWKS_URI 추가
- `.env.template` - SUPABASE_JWKS_URI 추가
