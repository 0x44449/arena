# Backend Conventions (Spring Boot)

## Package Structure

```
com.arena.backend/
├── ArenaBackendApplication.java
├── config/             # WebConfig, SwaggerConfig
├── security/           # SecurityConfig, JWT, @CurrentUser
├── global/
│   ├── dto/            # ApiResult, SingleApiResult, ...
│   ├── exception/      # WellKnownException, GlobalExceptionHandler
│   ├── util/           # IdGenerator
│   └── entity/         # BaseTimeEntity
└── domain/
    ├── user/           # Controller, Service, Repository, Entity, dtos/
    ├── channel/
    ├── message/
    ├── contact/
    ├── device/
    ├── file/
    └── gateway/
```

## Naming

| Target | Style | Example |
|--------|-------|---------|
| Package | lowercase | `com.arena.backend.domain.user` |
| Class | PascalCase | `UserController`, `UserEntity` |
| Method | camelCase | `createDirectChannel`, `getMe` |
| DB Column | camelCase (quoted) | `"channelId"`, `"lastMessageAt"` |
| Error code | UPPER_SNAKE_CASE | `USER_NOT_FOUND` |

## Domain Module Pattern

Each domain package contains:

```
domain/user/
├── UserController.java       # @RestController, routes
├── UserService.java          # Business logic
├── UserRepository.java       # JPA repository
├── UserEntity.java           # @Entity
└── dtos/
    ├── CreateUserRequest.java
    ├── UpdateUserRequest.java
    └── UserResponse.java
```

## Controller Rules

- Base path on class: `@RequestMapping("/api/v1/users")`
- Every endpoint has `@Operation(operationId = "...")` matching NestJS convention
- Return `SingleApiResult.of(data)`, `ListApiResult.of(list)`, etc.
- Use `@CurrentUser JwtPayload user` for authenticated user

## DTO Rules

- **Global response DTOs**: `global/dto/` — `ApiResult`, `SingleApiResult<T>`, etc.
- **Module request DTOs**: `domain/*/dtos/` — per module
- Use Jakarta Validation annotations: `@NotBlank`, `@Size`, `@Email`

## Entity Rules

- Extend `BaseTimeEntity` for `createdAt`, `updatedAt`, `deletedAt`
- Use `@Column(name = "columnName")` with exact camelCase names
- JPA configured with `globally_quoted_identifiers=true` and `PhysicalNamingStrategyStandardImpl`

## Mapper Rules

- Static methods or standalone utility classes
- Pure functions — no injected dependencies
- Controller handles async work, passes results to mapper

## Error Handling

- Throw `WellKnownException(errorCode)` for business errors
- `GlobalExceptionHandler` catches and wraps in `ApiResult.error(code)`
- Business errors → HTTP 200 + errorCode
- Auth errors → HTTP 401/403

## JPA / Hibernate

- `ddl-auto: validate` — never auto-create/update schema
- Use Flyway or manual migrations for schema changes
- `open-in-view: false` — no lazy loading outside transaction

## Configuration

- `application.yml` with environment variable substitution: `${DB_HOST:localhost}`
- Server port: 8003 (coexists with NestJS on 8002)
