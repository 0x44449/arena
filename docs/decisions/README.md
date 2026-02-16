# Architecture Decisions

Key design decisions made during the Arena project.

## 1. Channel Type Inheritance (Table-per-Subclass)

**Decision**: Base `channels` table + extension tables (`direct_channels`, `group_channels`).

**Rejected**: Single Table Inheritance (STI).

**Rationale**: Avoids nullable columns, clearer type separation, easier to extend with new channel types (e.g., `team`). Each extension table only adds columns relevant to that type.

## 2. Participant Extension Pattern

Same table-per-subclass approach for participants:
- `participants` — base table with common fields (`lastReadAt`)
- `direct_participants` — no extra fields
- `group_participants` — adds `role` (owner/member), `nickname`

OneToOne relationship from extension to base table.

## 3. File Reference via FK

**Decision**: Reference `FileEntity` by FK (`avatarFileId`, `iconFileId`) instead of storing S3 keys directly.

**Rationale**: Consistent metadata management, enables file lifecycle tracking, better audit trail.

## 4. S3 Storage Key Structure

**Decision**: `{userId}/{directory}/{fileId}` (e.g., `abc123/avatars/def456`).

**Rationale**: Allows permission checks via `startsWith(userId)`. File ID makes the key unique and unpredictable.

## 5. Message Sequencing via DB Subquery

**Decision**: Use `COALESCE(MAX(seq), 0) + 1` in INSERT subquery instead of Redis INCR.

**Previous**: Redis `INCR channel:{channelId}:seq`.

**Rationale**: Redis reset causes seq conflicts. DB subquery is atomic, no cross-system sync needed. Performance difference negligible (~1-5ms with index).

## 6. Business Errors Return HTTP 200

**Decision**: `WellKnownException` returns HTTP 200 with `{ success: false, errorCode: "..." }`.

**Rationale**: Separates business logic errors from HTTP transport errors. Only authentication (401), authorization (403), and not-found (404) use actual HTTP status codes.

## 7. Sync API over Event Log

**Decision**: `updatedAt`-based sync with `since` parameter.

**Rejected**: Event sourcing / event log pattern.

**Rationale**: Simpler implementation for expected scale (<100 changes per sync). Returns `requireFullSync: true` when changes exceed threshold.

## 8. Session Caching in Redis

**Decision**: Cache full user info in Redis with 5-minute TTL (key: `session:{uid}`).

**Rationale**: Reduces DB queries per request. Invalidated via Signal pub/sub when user profile updates.

## 9. Nanoid for Entity IDs

**Decision**: 12-character alphanumeric nanoid (`0-9A-Za-z`).

**Rejected**: UUID (36 chars), auto-increment (predictable).

**Rationale**: URL-friendly, shorter, sufficient collision safety (62^12 ≈ 3.2 × 10^21 combinations).

## 10. utag Column Preserved but Not Used in API

**Decision**: Changed API from utag-based lookup to userId. utag column kept for future search feature.

**Rationale**: Reduces API complexity. userId is the natural key for most operations.

## 11. Mapper Functions as Pure Functions

**Decision**: Mappers are synchronous, pure functions with no DI dependencies.

**Rationale**: Controllers handle async work (e.g., generating S3 URLs) and pass results to mappers. Keeps mappers testable and simple.

## 12. Frontend: Defer Offline Architecture

**Decision**: Use React Query for direct server calls during MVP. Add SQLite offline layer later.

**Rationale**: Complete MVP first, avoid premature complexity. Offline architecture can be layered on without major refactoring.
