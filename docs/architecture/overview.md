# System Architecture Overview

## Project Structure

Arena is a real-time messenger application built as a monorepo:

```
arena/
├── apps/backend/       # Spring Boot REST + WebSocket server (Java 21)
├── arena-backend/      # [Legacy] NestJS server (TypeScript) — being replaced
├── arena-app/          # React Native mobile/web client (Expo 54, React 19)
├── docs/               # Project documentation
└── arena.code-workspace
```

## Tech Stack

### Backend (Spring Boot)
| Component | Technology |
|-----------|-----------|
| Framework | Spring Boot 3.5, Java 21 |
| ORM | Spring Data JPA (Hibernate) |
| Database | PostgreSQL 18 |
| Cache | Redis (Spring Data Redis) |
| Auth | Supabase JWT (ES256, JWKS) via Spring Security OAuth2 Resource Server |
| File Storage | AWS S3 (LocalStack in dev) |
| API Docs | springdoc-openapi (Swagger UI) |
| Build | Gradle (Kotlin DSL) |

### Frontend (React Native)
| Component | Technology |
|-----------|-----------|
| Framework | React Native + Expo 54, React 19 |
| Routing | Expo Router (file-based) |
| State | useState + Zustand |
| API Client | Orval (auto-generated from Swagger) |
| Auth | Supabase (Google + Kakao social login) |
| Offline DB | SQLite via expo-sqlite |

### Infrastructure (Docker Compose)
| Service | Port |
|---------|------|
| PostgreSQL 18 | 15432 |
| Redis | 16379 |
| LocalStack (S3) | 14566 |
| Adminer | 18080 |

## Authentication Flow

1. Client authenticates via Supabase (Google/Kakao OAuth)
2. Supabase issues ES256 JWT
3. Client sends JWT in `Authorization: Bearer <token>` header
4. Backend validates JWT signature via Supabase JWKS endpoint
5. JWT `sub` claim = Supabase user ID (mapped to `users.uid`)
6. Session guard caches user info in Redis (5 min TTL, key: `session:{uid}`)

## API Response Format

All responses follow a standardized envelope:

```json
// Success
{ "success": true, "errorCode": null, "data": { ... } }

// Business error (HTTP 200)
{ "success": false, "errorCode": "USER_NOT_FOUND" }

// HTTP errors use actual status codes (401, 403, 404, 500)
```

Response wrapper types:
- `ApiResult` — success/error only
- `SingleApiResult<T>` — single data object
- `ListApiResult<T>` — array of data
- `InfinityListApiResult<T>` — array + `hasNext`, `hasPrev` for cursor pagination

## ID Generation

All entity IDs use nanoid: 12 alphanumeric characters (`0-9A-Za-z`), generated via `SecureRandom`.

Example: `aB3dE7fG9hJ2`

## Real-time Communication

- Protocol: Socket.IO over WebSocket
- Path: `/ws`, Namespace: `/arena`
- Auth: JWT in `auth.token` during handshake
- Pub/Sub: Redis for cross-process event broadcasting
