# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Arena — 5~20인 소규모 팀을 위한 모바일 기반 경량 그룹웨어. 카톡으로 버티는 소규모 업장에 메신저 중심의 업무 도구를 제공한다.

- **코어**: 메신저 + Org/Team 관리
- **확장**: 공지확인, 간단 결재(휴가/경비), 출퇴근 기록(근태관리)
- 자세한 시장 분석 및 제품 전략은 `docs/PROJECT.md` 참조

## Monorepo Structure

```
apps/
  backend/    — Spring Boot 3.5 REST + WebSocket (Java 21)
  mobile/     — React Native / Expo (TypeScript)
  web/        — 관리용 웹앱 (미정)
infra/docker/ — Docker Compose 배포 구성
docs/         — 프로젝트 문서
legacy/       — 참고용 기존 코드 (삭제 예정)
```

## Build & Run Commands

### Backend (apps/backend/)
```bash
cd apps/backend
./gradlew build            # Compile + test
./gradlew bootRun          # Dev server (port 8080)
./gradlew test             # Run tests
./gradlew clean build      # Clean build
```

### Docker Deployment
```bash
docker compose -f infra/docker/docker-compose.yml up -d   # Start all services
./deploy.sh                   # Full deploy (supports --no-cache, --down, --clean)
./deploy.sh --no-cache api    # Rebuild specific service without cache
```

## Architecture

### Backend (Spring Boot)

- **Package**: `app.sandori.arena.api`
  - `config/` — SwaggerConfig, WebConfig 등 설정
  - `global/dto/` — 공통 응답 DTO (`ApiResult`, `SingleApiResult<T>`, `ListApiResult<T>`, `InfinityListApiResult<T>`)
  - `global/entity/` — `BaseTimeEntity` (createdAt, updatedAt, deletedAt)
  - `global/exception/` — `WellKnownException`, `GlobalExceptionHandler`
  - `global/util/` — `IdGenerator` (SecureRandom 12-char alphanumeric)
  - `security/` — Spring Security + Supabase JWT (OAuth2 Resource Server + JWKS)
  - `domain/` — 도메인별 패키지 (Controller, Service, Repository, Entity, dtos/)
- **Auth**: Supabase JWT (ES256). `@CurrentUser JwtPayload` 어노테이션으로 현재 사용자 주입
- **DB**: PostgreSQL, JPA with `PhysicalNamingStrategyStandardImpl` + `globally_quoted_identifiers=true`
- **Swagger**: springdoc-openapi — UI: `/swagger`, JSON: `/swagger-json`

### Profile 기반 시스템

**User는 인증용, 모든 활동은 Profile 기준으로 동작한다.**

- User = 가입/인증 증빙. Supabase uid와 1:1 매핑
- Profile = 실제 활동 주체. 기본 프로필(orgId=null) + Org별 프로필(orgId 지정)
- Org 멤버십 = Profile 자체 (별도 멤버십 테이블 없음). `profile.role`로 OWNER/USER 구분
- Team 멤버, Channel 멤버, 메시지 발신자 등 모든 참조는 `profileId` 사용
- Org 가입 시 기본 프로필 이름을 복사해 Org 전용 프로필 자동 생성

### 도메인 구조

| 도메인 | 역할 | 상태 |
|--------|------|------|
| user | 계정 가입/인증 (Supabase uid 연동) | 구현 완료 |
| profile | 기본/Org별 프로필 관리, Org 멤버십 | 구현 완료 |
| org | 조직 생성/관리, 초대 코드 | 구현 완료 |
| team | Org 내 하위 그룹 (profileId 기반) | 구현 완료 |
| channel | DM, 그룹 대화방 (profileId 기반) | 구현 완료 |
| message | 메시지 CRUD, 검색 | REST 구현 |
| file | 파일/이미지 업로드 (S3) | 미구현 |
| attendance | 출퇴근 기록 (근태관리) | 미구현 |
| approval | 간단 결재 (휴가/경비) | 미구현 |

### Frontend (Mobile — React Native / Expo)

- **Expo Router** file-based routing in `app/` — 라우팅만, 로직 없음
- **Screen implementations** in `screens/` — 실제 UI 로직
  - `controls/` subfolder: 해당 스크린 전용 컴포넌트
- **`components/`**: 스크린 간 공유 UI만
- **Offline-first**: SQLite via expo-sqlite
  - `offline/db/schema/` — 테이블명, 컬럼 상수, 타입, 파서
  - `offline/db/queries/` — CRUD 함수
  - `offline/db/migrations/` — 순차적 마이그레이션
- **API client**: Orval로 자동 생성 (`api/generated/`)
- **Auth**: Supabase (소셜 로그인), Axios interceptor로 토큰 주입
- **State**: useState 우선, Zustand (크로스 스크린)

### Infrastructure

- **배포**: Docker Compose (`infra/docker/`)
- **Docker ports**: API=18080, Web=13000 (외부 포트는 1만번대, `.env`로 관리)
- **서비스**: PostgreSQL, Redis, MinIO (S3 호환), Backend API, (향후 Mobile/Web)
- **Dockerfile**: Multi-stage build, non-root user, health check
- **deploy.sh**: `--no-cache`, `--down`, `--clean` 옵션 지원

## Tech Stack

- Backend: Spring Boot 3.5, Java 21, PostgreSQL, Redis
- Mobile: React Native, Expo, TypeScript, SQLite
- Web: 미정
- Auth: Supabase Auth
- File Storage: MinIO (S3 호환, Docker) / S3 (production)
- Infra: Docker Compose

## Coding Conventions

1. **No premature abstraction**: 인라인 우선. 명시적 요청 없이 공통 함수 추출 금지. 클래스 수 최소화
2. **YAGNI**: 지금 필요한 것만 구현. 하드코딩 우선, 인터페이스는 구현체 2개 이상일 때만
3. **Happy path first**: 에러 핸들링은 실제 실패가 발생할 때 추가
4. **One component per file**: `export default function ComponentName()`. index.ts 재수출 금지
5. **Frontend DB queries**: params 첫번째 인자(object), optional `db` 두번째 인자(트랜잭션)
6. **Server DTOs on frontend**: Orval 생성 타입 사용. 별도 UI 모델은 조인 필요시만
7. **Backend DTO placement**: `global/dto/` (공통 응답), `domain/*/dtos/` (요청/도메인별 응답)
8. **Feature-based packages**: 레이어가 아닌 기능 단위로 패키지 구성. 공통 코드는 가장 가까운 공통 위치에
9. **No FK constraints**: DB 마이그레이션에서 Foreign Key를 생성하지 않는다. 명시적으로 요청할 때만 추가

### Comment Rules

- **Language**: 모든 주석은 한글
- **Content**: "무엇"이 아닌 "왜"를 설명. 매직넘버, 우회 코드, 특수 케이스 설명
- **Markers**: `// TODO:` 미완성 작업, `// FIXME:` 알려진 이슈

## Workflow

### 구현 규칙

- 요청된 범위 내에서만 작업한다
- 요청하지 않은 에러 처리, 로깅, 검증, "개선"을 추가하지 않는다
- 불명확한 부분은 구현 전에 확인한다
- 불확실한 부분은 `// TODO:` 로 남긴다

### 커밋 규칙

- **컨펌 없이 절대 커밋하지 않는다**
- 커밋 메시지: `<type>: <subject>` (한글, 50자 이내)
- Type: `feat`, `fix`, `refactor`, `chore`, `docs`
- Body(선택): 변경 사항 간략 나열
- `git push`는 명시적으로 요청할 때만 수행

## Environment

Docker 환경 변수는 `infra/docker/.env`로 관리 (`.env.example` 참조).
Backend 로컬 실행 시 `apps/backend/.env` 필요 (`.env.template` 참조).
