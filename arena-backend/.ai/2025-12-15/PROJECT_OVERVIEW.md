# Arena Backend - 프로젝트 개요

## 기술 스택
- **Framework:** NestJS
- **ORM:** TypeORM
- **Database:** PostgreSQL
- **Auth:** Supabase (JWT)
- **File Storage:** AWS S3 (LocalStack for dev)
- **Cache:** Redis

## 현재 구현된 모듈
| 모듈 | 위치 | 상태 |
|------|------|------|
| User | `src/modules/user` | ✅ 완료 |
| File | `src/modules/file` | ✅ 완료 |
| Device | `src/modules/device` | ✅ 완료 |
| Direct Channel | `src/modules/direct-channel` | 🚧 진행 중 |

## 엔티티 목록
| 엔티티 | 테이블 | 설명 |
|--------|--------|------|
| UserEntity | users | 사용자 |
| FileEntity | files | 파일 메타데이터 |
| DeviceEntity | devices | 푸시 알림용 기기 |
| ChannelEntity | channels | 채널 공통 |
| ParticipantEntity | participants | 채널 참여자 공통 |
| DirectChannelEntity | direct_channels | 1:1 채널 확장 |
| DirectParticipantEntity | direct_participants | 1:1 참여자 확장 |

## 폴더 구조
```
src/
├── auth/                 # 인증 (JWT strategy)
├── database/             # TypeORM 설정
├── decorators/           # 커스텀 데코레이터
├── dtos/                 # 공통 DTO
├── entities/             # 엔티티
├── exceptions/           # 커스텀 예외
├── filters/              # 예외 필터
├── guards/               # 인증 가드
├── modules/              # 기능 모듈
│   ├── user/
│   ├── file/
│   ├── device/
│   └── direct-channel/
├── types/                # 타입 정의
├── utils/                # 유틸리티 (mapper, id-generator)
├── app.module.ts
└── main.ts
```
