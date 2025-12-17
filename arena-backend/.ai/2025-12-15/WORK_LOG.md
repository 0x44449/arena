# 2024-12-15 작업 내역

## 1. 파일 관련 정리
- `CreateFileDto`에서 불필요한 `mimeType`, `size` 필드 제거 (S3 메타데이터에서 가져옴)
- `originalName` → `name`으로 변경

## 2. User-Avatar 구조 변경
**변경 전:** `UserEntity.avatarKey` (S3 key 직접 저장)
**변경 후:** `UserEntity.avatarFileId` (FileEntity FK)

- `UserEntity`에 `avatar: FileEntity` relation 추가
- `UserDto`에서 `avatarUrl: string` → `avatar: FileDto` 변경
- `user.mapper.ts` 순수 함수로 유지: `toUserDto(entity, avatar: FileDto | null)`
- `UserController`에서 인라인으로 avatar 변환 처리 (헬퍼 메서드 없이 명시적으로)

## 3. 채널 구조 설계 및 구현

### 설계 결정사항
- **채널 타입:** direct(1:1) / group / team
- **구조:** 공통 테이블 + 타입별 확장 테이블 (relation 방식)
- **멤버:** `participant`라는 이름 사용 (channel_member 대신)

### 테이블 구조
```
channels (공통)
participants (공통)

direct_channels (→ channels, 1:1)
direct_participants (→ participants, 1:1)

group_channels (→ channels) - 미구현
group_participants (→ participants) - 미구현

team_channels (→ channels) - 미구현  
team_participants (→ participants) - 미구현
```

### 생성된 엔티티
- `src/entities/channel.entity.ts` - 공통 채널 (channelId, type, name, teamId, lastMessageAt)
- `src/entities/participant.entity.ts` - 공통 참여자 (channelId, userId, lastReadAt, joinedAt)
- `src/entities/direct-channel.entity.ts` - Direct 채널 확장 (현재 추가 필드 없음)
- `src/entities/direct-participant.entity.ts` - Direct 참여자 확장 (현재 추가 필드 없음)

## 4. Direct Channel API 설계 (진행 중)

### 모듈 위치
`src/modules/direct-channel/`

### API 목록
| Method | Endpoint | Body | 설명 |
|--------|----------|------|------|
| POST | `/api/v1/direct-channels` | `{ userId }` | DM 생성 (이미 있으면 기존 반환) |
| GET | `/api/v1/direct-channels` | - | 내 DM 목록 |
| GET | `/api/v1/direct-channels/:channelId` | - | DM 상세 조회 |

### 생성된 파일
- `direct-channel.controller.ts` - API 틀만 잡아놓은 상태 (TODO)
- `dtos/create-direct-channel.dto.ts` - 생성 요청 DTO

### 다음 작업
- [ ] `DirectChannelService` 구현
- [ ] `DirectChannelModule` 생성 및 app.module에 등록
- [ ] 응답 DTO 설계
- [ ] 나가기(leave) 기능 논의 필요 (DM 특성상 어떻게 처리할지)

---

## 삭제 필요한 파일
- `src/modules/direct/` 폴더 전체 (direct-channel로 이동함)
- `src/entities/dm-channel.entity.ts` (있다면 - direct-channel로 변경됨)

---

## 설계 논의 메모

### Public 팀 vs 분리 구조
- 초기에 "보이지 않는 public 팀"으로 DM/그룹챗 처리하려 했으나
- 결국 채널 타입별로 분리하는 게 더 명확하다고 결론
- `teamId = null`이면 DM/Group, 있으면 Team 채널

### 테이블 분리 vs 통합
- Single Table Inheritance 대신 별도 테이블 + relation 방식 선택
- nullable 필드 최소화
- 타입별 로직 분리 용이
- 조회 시 필요한 join은 서비스에서 쿼리로 처리

### Mapper 설계
- mapper는 순수 함수로 유지
- 비동기 작업(S3 URL 생성 등)은 controller에서 처리 후 mapper에 전달
- DI 가능한 mapper는 오버엔지니어링으로 판단
