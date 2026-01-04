# 2026-01-04 작업 내역

## 1. WebSocket 실시간 메시징 구현

### 구현 내용
- Socket.IO 기반 WebSocket Gateway 구현
- Redis Pub/Sub을 통한 메시지 브로드캐스트
- JWT 인증 (Handshake 시점 검증)

### 설정
- 경로: `/ws`
- 네임스페이스: `/arena`
- 클라이언트 연결: `io("http://localhost:8002/arena", { path: "/ws", auth: { token } })`

### 이벤트
- `channel:join` - 채널 Room 입장
- `channel:leave` - 채널 Room 퇴장
- `message:new` - 새 메시지 수신 (서버 → 클라이언트)

---

## 2. Signal 모듈 (Pub/Sub 추상화)

### 목적
- Redis Pub/Sub 구현을 캡슐화
- 타입 안전한 이벤트 발행/구독
- 나중에 다른 메시지 브로커로 교체 가능

### 구조
```
src/signal/
├── signal.module.ts      # Global 모듈
├── signal.service.ts     # publish/subscribe
└── signal.channels.ts    # 채널명 + 타입 정의
```

### 사용법
```typescript
// 발행
await this.signal.publish(SignalChannel.USER_UPDATED, { uid });

// 구독
this.signal.subscribe(SignalChannel.MESSAGE_NEW, ({ channelId, message }) => { ... });
```

### 채널 목록
| 채널 | 페이로드 | 용도 |
|------|----------|------|
| `user:updated` | `{ uid: string }` | 세션 캐시 무효화 |
| `message:new` | `{ channelId, message }` | 실시간 메시지 브로드캐스트 |

---

## 3. Session 모듈 (유저 캐싱)

### 목적
- 매 요청마다 DB 조회 방지
- Redis에 유저 정보 캐싱 (5분 TTL)
- 유저 정보 변경 시 자동 무효화

### 구조
```
src/modules/session/
├── session.module.ts     # Global 모듈
├── session.service.ts    # 캐시 관리, getOrFetch
├── session.guard.ts      # 요청마다 세션 로드
└── session.types.ts      # CachedUser 타입
```

### 플로우
```
요청 → ArenaJwtAuthGuard (JWT 검증)
     → SessionGuard (Redis 캐시 조회 / DB fallback)
     → Controller (@CurrentUser()로 CachedUser 사용)
```

### 무효화 플로우
```
UserService.update() 
  → signal.publish('user:updated')
  → SessionService.invalidate()
```

---

## 4. Decorator 정리

### 변경 전
- `@CurrentUser()` → JWT payload

### 변경 후
| Decorator | 반환 타입 | 용도 |
|-----------|----------|------|
| `@JwtPayloadParam()` | `JwtPayload` | JWT에서 uid, email 추출 |
| `@CurrentUser()` | `CachedUser` | 캐시된 유저 정보 (userId, utag, nick 등) |

---

## 5. Redis 모듈 정리

### 구조
```
src/redis/
├── redis.module.ts       # Global 모듈
└── redis.constants.ts    # REDIS_CLIENT, REDIS_SUBSCRIBER
```

### 인스턴스
- `REDIS_CLIENT` - 일반 명령용 (GET, SET, INCR, PUBLISH)
- `REDIS_SUBSCRIBER` - Subscribe 전용

### 사용처 통합
- MessageService (seq 채번)
- S3Service (presigned URL 캐싱)
- SessionService (유저 캐싱)
- SignalService (Pub/Sub)

---

## 6. 버그 수정

### uid/userId 혼동 수정
- DeviceController: `jwt.uid` → `user.userId`
- FileController: `jwt.uid` → `user.userId`
- FileEntity.ownerId는 UserEntity.userId를 참조해야 함

---

## 7. 코드 정리

### UserService
- `getByUid()` 추가 - 없으면 예외 발생
- `findByUid()` 유지 - null 반환 가능

### Controller 통일
- 대부분: `@UseGuards(ArenaJwtAuthGuard, SessionGuard)` + `@CurrentUser()`
- UserController: `@JwtPayloadParam()` 유지 (null 허용 케이스)

### 삭제된 파일
- `src/modules/file/redis.service.ts` - RedisModule로 통합

---

## 변경된 파일 목록

### 신규 생성
- `src/signal/signal.module.ts`
- `src/signal/signal.service.ts`
- `src/signal/signal.channels.ts`
- `src/modules/session/session.module.ts`
- `src/modules/session/session.service.ts`
- `src/modules/session/session.guard.ts`
- `src/modules/session/session.types.ts`
- `src/modules/gateway/arena.gateway.ts`
- `src/modules/gateway/gateway.module.ts`
- `src/guards/ws-jwt-auth.guard.ts`
- `src/redis/redis.module.ts`
- `src/redis/redis.constants.ts`
- `src/decorators/jwt-payload.decorator.ts`
- `src/decorators/current-user.decorator.ts` (새로 작성)

### 수정
- `src/app.module.ts` - RedisModule, SignalModule, SessionModule, GatewayModule 추가
- `src/modules/user/user.service.ts` - getByUid 추가, Signal 연동
- `src/modules/user/user.controller.ts` - JwtPayloadParam 사용
- `src/modules/message/message.service.ts` - Signal 연동
- `src/modules/message/message.controller.ts` - CurrentUser 사용
- `src/modules/channel/channel.controller.ts` - CurrentUser 사용
- `src/modules/contact/contact.controller.ts` - CurrentUser 사용
- `src/modules/device/device.controller.ts` - CurrentUser 사용, 버그 수정
- `src/modules/file/file.controller.ts` - CurrentUser 사용, 버그 수정
- `src/modules/file/s3.service.ts` - REDIS_CLIENT 사용
- `src/modules/file/file.module.ts` - forwardRef 추가

### 삭제
- `src/modules/file/redis.service.ts`
