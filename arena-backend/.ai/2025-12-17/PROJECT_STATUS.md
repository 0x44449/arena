# Arena Backend - 프로젝트 현황 (2025-12-17 기준)

## 기술 스택
- **Framework:** NestJS
- **ORM:** TypeORM
- **Database:** PostgreSQL
- **Auth:** Supabase (JWT)
- **File Storage:** AWS S3 (LocalStack for dev)
- **Cache:** Redis

## 모듈 현황

| 모듈 | 위치 | 상태 |
|------|------|------|
| User | `src/modules/user` | ✅ 완료 |
| File | `src/modules/file` | ✅ 완료 |
| Device | `src/modules/device` | ✅ 완료 |
| Channel | `src/modules/channel` | 🚧 진행 중 |

## Channel 모듈 상세

### 구현 완료
- Direct Channel 생성 (getOrCreate)
- Group Channel 생성
- 채널 목록 조회 (통합)
- 채널 상세 조회 (통합)

### 미구현
- Team Channel
- 채널 나가기/삭제
- 초대/강퇴

## 엔티티 목록

| 엔티티 | 테이블 | 설명 |
|--------|--------|------|
| UserEntity | users | 사용자 |
| FileEntity | files | 파일 메타데이터 |
| DeviceEntity | devices | 푸시 알림용 기기 |
| ChannelEntity | channels | 채널 공통 |
| ParticipantEntity | participants | 채널 참여자 공통 |
| DirectChannelEntity | direct_channels | DM 채널 확장 |
| DirectParticipantEntity | direct_participants | DM 참여자 확장 |
| GroupChannelEntity | group_channels | 그룹 채널 확장 |
| GroupParticipantEntity | group_participants | 그룹 참여자 확장 |

## API 현황

### User
| Method | Endpoint | 설명 |
|--------|----------|------|
| GET | `/api/v1/users/me` | 내 정보 |
| GET | `/api/v1/users/tag/:tag` | 태그로 유저 조회 |
| PATCH | `/api/v1/users/tag/:tag` | 유저 정보 수정 |
| POST | `/api/v1/users` | 유저 생성 |

### File
| Method | Endpoint | 설명 |
|--------|----------|------|
| POST | `/api/v1/files/presigned-url` | 업로드 URL 발급 |
| POST | `/api/v1/files` | 파일 메타데이터 생성 |

### Device
| Method | Endpoint | 설명 |
|--------|----------|------|
| POST | `/api/v1/devices` | 기기 등록 |
| DELETE | `/api/v1/devices/:deviceId` | 기기 삭제 |

### Channel
| Method | Endpoint | 설명 |
|--------|----------|------|
| POST | `/api/v1/channels/direct` | DM 생성 |
| POST | `/api/v1/channels/group` | 그룹 생성 |
| GET | `/api/v1/channels` | 내 채널 목록 |
| GET | `/api/v1/channels/:channelId` | 채널 상세 |

## 폴더 구조
```
src/
├── auth/                 # 인증 (JWT strategy)
├── database/             # TypeORM 설정
├── decorators/           # 커스텀 데코레이터
├── dtos/                 # 공통 DTO
│   ├── user.dto.ts
│   ├── file.dto.ts
│   ├── channel.dto.ts
│   └── participant.dto.ts
├── entities/             # 엔티티
├── exceptions/           # 커스텀 예외
├── filters/              # 예외 필터
├── guards/               # 인증 가드
├── modules/              # 기능 모듈
│   ├── user/
│   ├── file/
│   ├── device/
│   └── channel/
├── types/                # 타입 정의
├── utils/                # 유틸리티
│   ├── id-generator.ts
│   ├── user.mapper.ts
│   ├── file.mapper.ts
│   ├── channel.mapper.ts
│   └── participant.mapper.ts
├── app.module.ts
└── main.ts
```

## 삭제 필요
- `src/modules/direct-channel/` 폴더 (channel로 통합됨)
