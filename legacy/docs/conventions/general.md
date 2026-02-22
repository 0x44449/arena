# General Coding Conventions

Rules that apply across both backend and frontend.

## 1. No Premature Abstraction

Keep logic inline. Do not extract common functions unless explicitly requested. Explicit code over clever abstractions. Three similar lines are better than a premature helper.

## 2. No Over-Engineering

Build for current requirements, not hypothetical future ones. Add complexity only when needed. Optimize for development speed in personal project context.

## 3. One Component/Class per File

Each file exports a single primary class or component. No barrel exports (`index.ts` re-exports).

## 4. Error Handling

- Business errors: `WellKnownException` with `errorCode` (UPPER_SNAKE_CASE)
- Error codes: `USER_NOT_FOUND`, `INVALID_REQUEST`, `CONFLICT`, etc.
- Business errors return HTTP 200 with `{ success: false, errorCode: "..." }`
- Only auth/transport errors use actual HTTP status codes

## 5. ID Generation

All entity IDs: nanoid 12 characters, alphanumeric (`0-9A-Za-z`).

## 6. Soft Deletes

All entities have `deletedAt` column. Never hard-delete data. Sync API includes soft-deleted items.

## 7. API Design

- Base path: `/api/v1/`
- Resource names: plural, kebab-case (`/channels`, `/presigned-url`)
- Methods: POST (create), GET (read), PATCH (update), DELETE
- Controller: base path on class, details on method

## 8. Response Envelope

All API responses wrapped in standard format:
- `ApiResult` — `{ success, errorCode }`
- `SingleApiResult<T>` — `+ data: T`
- `ListApiResult<T>` — `+ data: T[]`
- `InfinityListApiResult<T>` — `+ data: T[], hasNext, hasPrev`

## 9. Swagger / OpenAPI

- Served at `/swagger` (UI) and `/swagger-json` (spec)
- Every endpoint has explicit `operationId` matching `Controller + Method` pattern
- Orval uses operationId to generate frontend API client function names
