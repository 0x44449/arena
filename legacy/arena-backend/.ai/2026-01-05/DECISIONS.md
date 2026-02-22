# Arena Backend - 설계 결정 기록

## 2026-01-05

### 1. Private Bucket 불필요 결정

**배경**
- 메신저에서 파일 보안이 필요한가?

**결론: 불필요**
- URL 자체가 추측 불가능 (nanoid)
- API 레벨에서 이미 권한 체크
- 카카오톡, 디스코드 등도 public URL 사용
- presigned URL 갱신 로직 불필요 → 단순해짐

**나중에 필요할 수 있는 경우**
- 기업용 보안 요구사항
- 법적 규제 (의료, 금융)

---

### 2. Mapper 동기화 결정

**배경**
- FileDto에 S3 URL이 필요
- S3Service.getPresignedDownloadUrl()이 async
- 컨트롤러가 점점 무거워짐

**해결책들**
1. Mapper를 Injectable 서비스로
2. S3Service에 static 메서드
3. 클라이언트가 URL 조립

**결론: S3Service에 static 메서드**
```typescript
static getFileUrl(bucket: string, storageKey: string): string
```
- Public 파일은 presigned 불필요
- Mapper는 동기 함수 유지
- 컨트롤러 코드 깔끔

---

### 3. Sync API vs Event Log

**배경**
- 앱 백그라운드/네트워크 재연결 시 동기화

**선택지**
1. updatedAt 기반 + soft delete
2. Event Log 테이블

**결론: updatedAt 기반**
- Event Log는 오버엔지니어링
- 100개 이하는 한번에 전달
- 초과 시 requireFullSync로 전체 refetch 유도

---

### 4. storageKey 구조

**Before**
```
directory/userId/timestamp.extension
예: avatars/abc123/1736067600000.jpg
```

**After**
```
userId/directory/fileId
예: abc123/avatars/xyz789
```

**이유**
- userId가 prefix → 권한 검증 단순 (`startsWith`)
- directory 선택사항
- nanoid로 충돌 방지
- 확장자 불필요 (Content-Type으로 충분)

---

### 5. utag vs userId API

**Before**
- `GET /users/tag/:tag` - utag로 조회
- utag는 배틀태그 스타일 (예: zina#0001)

**After**
- `GET /users/:userId` - userId로 조회
- utag 컬럼은 유지 (나중에 검색용)

**이유**
- API 2벌 유지 복잡
- utag 변경 시 처리 복잡
- 조기 최적화

---

### 6. Signal 네이밍

**Before**: `SignalService`
**After**: `Signal`

**이유**
- 비즈니스 로직 아님
- 인프라 레이어 (메시지 브로커 어댑터)
- Service 접미사는 비즈니스 서비스에만

---

## 이전 결정 사항 (참고)

### nanoid(12) 사용
- UUID 대신 nanoid
- 알파벳: `0-9a-z` (36자)
- URL 친화적, 짧음

### 채널 구조: 공통 + 확장 테이블
- 공통: channels, participants
- DM: direct_channels, direct_participants
- Group: group_channels, group_participants
- Team: (미구현)

### 메시지 seq: Redis INCR
- DB 시퀀스 대신 Redis
- 채널별 독립 시퀀스
- cursor pagination에 사용

### JWT: ES256 (비대칭)
- HS256에서 업그레이드
- Supabase JWKS로 공개키 조회
- 서버에 비밀키 없음
