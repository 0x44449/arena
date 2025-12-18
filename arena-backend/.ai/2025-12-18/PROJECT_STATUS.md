# Arena Backend - 프로젝트 현황 (2025-12-18 기준)

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
| Channel | `src/modules/channel` | ✅ 완료 |
| Message | `src/modules/message` | ✅ 완료 |
| Contact | `src/modules/contact` | ✅ 완료 |

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
| MessageEntity | messages | 메시지 |
| ContactEntity | contacts | 연락처 |

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
| POST | `/api/v1/files/public/presigned-url` | Public 업로드 URL 발급 |
| POST | `/api/v1/files/public` | Public 파일 메타데이터 생성 |
| POST | `/api/v1/files/private/presigned-url` | Private 업로드 URL 발급 |
| POST | `/api/v1/files/private` | Private 파일 메타데이터 생성 |
| GET | `/api/v1/files/:fileId` | 파일 조회 |
| DELETE | `/api/v1/files/:fileId` | 파일 삭제 |

### Device
| Method | Endpoint | 설명 |
|--------|----------|------|
| POST | `/api/v1/devices/register` | 기기 등록 |
| POST | `/api/v1/devices/unregister` | 기기 삭제 |

### Channel
| Method | Endpoint | 설명 |
|--------|----------|------|
| POST | `/api/v1/channels/direct` | DM 생성 (getOrCreate) |
| POST | `/api/v1/channels/group` | 그룹 생성 |
| GET | `/api/v1/channels` | 내 채널 목록 |
| GET | `/api/v1/channels/:channelId` | 채널 상세 |

### Message
| Method | Endpoint | 설명 |
|--------|----------|------|
| POST | `/api/v1/messages/channel/:channelId` | 메시지 보내기 |
| GET | `/api/v1/messages/channel/:channelId` | 메시지 목록 (커서 페이지네이션) |

### Contact
| Method | Endpoint | 설명 |
|--------|----------|------|
| GET | `/api/v1/contacts` | 내 연락처 목록 |
| POST | `/api/v1/contacts` | 연락처 추가 |
| DELETE | `/api/v1/contacts/:userId` | 연락처 삭제 |

## 폴더 구조
```
src/
├── auth/                 # 인증 (JWT strategy)
├── database/             # TypeORM 설정
├── decorators/           # 커스텀 데코레이터
├── dtos/                 # 공통 DTO (클라이언트 응답용)
├── entities/             # 엔티티
├── exceptions/           # 커스텀 예외
├── filters/              # 예외 필터
├── guards/               # 인증 가드
├── modules/              # 기능 모듈
│   ├── user/
│   ├── file/
│   ├── device/
│   ├── channel/
│   ├── message/
│   └── contact/
├── seeds/                # 테스트 데이터 시더
├── types/                # 타입 정의
├── utils/                # 유틸리티 (mapper, id-generator 등)
├── app.module.ts
└── main.ts
```
