# Arena Backend - 설계 논의 기록 (2026-01-01)

## 클라이언트 상태 관리

### 배경
메신저 앱에서 상태 관리 방식 고민. React Query의 장단점과 대안 검토.

### React Query의 문제점 (메신저 관점)

1. **캐시키 관리 복잡**
   ```typescript
   ['messages', channelId]
   ['messages', channelId, { before: 'msg123' }]
   ['messages', channelId, { limit: 50 }]
   // 어떤 키를 invalidate 해야 하지?
   ```

2. **정규화 미지원**
   - 같은 유저 데이터가 여러 query에 중복 저장
   - 유저 상태 변경 시 모든 관련 query 업데이트 필요

3. **실시간 업데이트와 어색한 조합**
   - 웹소켓으로 데이터 오면 `setQueryData`로 억지로 끼워맞춤
   - React Query의 본래 철학(서버 상태 캐싱)과 안 맞음

### 정규화 스토어 방식

```typescript
// 데이터를 ID 기준으로 분리 저장
{
  users: {
    'user1': { userId: 'user1', nick: 'Zina', status: 'online' }
  },
  channels: {
    'ch1': { channelId: 'ch1', participantIds: ['user1', 'user2'] }
  }
}

// 유저 상태 변경 시 한 곳만 업데이트
users['user1'].status = 'offline'  // 끝
```

### React Query의 장점 (여전히 유효)

- 캐싱 자동화
- retry 자동 재시도
- loading/error 상태 관리
- optimistic update + rollback

### 고려 중인 옵션

1. **Zustand만 사용**
   - 장점: 단순, 데이터 흐름 추적 쉬움
   - 단점: 로딩/에러/retry 직접 구현

2. **React Query + 정규화 스토어**
   - React Query로 fetch → 정규화해서 스토어에 저장
   - 컴포넌트는 스토어에서 읽음
   - 웹소켓은 스토어 직접 업데이트

3. **경량 fetch 훅 + Zustand**
   - 간단한 useAsync 훅 직접 구현
   - React Query의 복잡함 없이 로딩/에러만 처리

### 결론
아직 미정. 실제 클라이언트 개발하면서 작은 범위로 테스트 후 결정.

---

## JWT 인증 방식 - HS256 vs ES256

### 배경
Supabase가 Legacy(HS256)와 새로운 방식(ES256/ECC) 두 가지 제공

### 비교

| | HS256 | ES256 |
|---|---|---|
| 알고리즘 | 대칭키 | 비대칭키 |
| 검증 방식 | 같은 비밀키 | 공개키만 |
| 키 유출 시 | 토큰 위조 가능 | 안전 |
| 키 로테이션 | 서버에 새 키 배포 필요 | JWKS가 자동 처리 |

### 결정
ES256 + JWKS 방식 채택

### 장점
- 공개키만 사용하므로 보안 강화
- 키 로테이션 시 서버 재배포 불필요
- JWKS 엔드포인트에서 공개키 자동 조회

### 구현
```typescript
secretOrKeyProvider: passportJwtSecret({
  cache: true,
  rateLimit: true,
  jwksRequestsPerMinute: 5,
  jwksUri: process.env.SUPABASE_JWKS_URI,
}),
algorithms: ["ES256"],
```
