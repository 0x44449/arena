# Arena MVP TODO

MVP 목표: **코어(메신저 + Org/Team 관리)를 완성도 높게 구현**

---

## Phase 0: 현재 작업 정리

- [x] 모노레포 스캐폴드 (apps/backend, apps/mobile, infra/docker)
- [x] Docker Compose 환경 구성 (PostgreSQL, Redis, MinIO, API)
- [x] 백엔드 스캐폴드 (Spring Boot 3.5, Java 21, Security, Swagger)
- [x] Supabase JWT 인증 연동 (OAuth2 Resource Server + JWKS)
- [x] 공통 응답 DTO (ApiResult, SingleApiResult, ListApiResult, InfinityListApiResult)
- [x] 공통 예외 처리 (WellKnownException, GlobalExceptionHandler)
- [x] BaseTimeEntity, IdGenerator
- [x] User 도메인 (가입, 내 정보 조회)
- [x] Profile 도메인 (기본 프로필, 수정)
- [x] Flyway 마이그레이션 (V1: users, profiles)
- [x] 모바일 스캐폴드 (Expo Router, Supabase 연동, Zustand auth store)
- [ ] 커밋 안 된 변경사항 정리 및 커밋

---

## Phase 1: Org/Team 관리 (백엔드)

Org가 있어야 메신저의 채널/메시지가 의미를 가진다. 백엔드 API를 먼저 완성한다.

### Org

- [ ] Org 엔티티 (orgId, name, description, avatarFileId, timestamps)
- [ ] OrgMember 엔티티 (orgMemberId, orgId, userId, role[OWNER/USER], timestamps)
- [ ] Org 생성 API — 생성자가 자동으로 OWNER
- [ ] Org 조회 API — 내가 속한 Org 목록
- [ ] Org 상세 조회 API
- [ ] Org 수정 API (OWNER만)
- [ ] 초대 코드 생성/관리 API (OWNER만)
- [ ] 초대 코드로 Org 가입 API — 가입 시 Org용 프로필 자동 생성
- [ ] Org 멤버 목록 조회 API
- [ ] Org 멤버 추방 API (OWNER만)
- [ ] Org 탈퇴 API
- [ ] Flyway 마이그레이션 (orgs, org_members, invite_codes 테이블)

### Team

- [ ] Team 엔티티 (teamId, orgId, name, timestamps)
- [ ] TeamMember 엔티티 (teamMemberId, teamId, userId, timestamps)
- [ ] Team 생성 API (OWNER만)
- [ ] Team 목록 조회 API (Org 내)
- [ ] Team 멤버 추가/제거 API (OWNER만)
- [ ] Team 삭제 API (OWNER만)
- [ ] Flyway 마이그레이션 (teams, team_members 테이블)

### Profile 확장

- [ ] Org별 프로필 조회/수정 API
- [ ] Org 가입 시 프로필 자동 분리 로직 연동

---

## Phase 2: 채널/채팅방 (백엔드)

메신저의 기반 구조. 실시간 메시징 전에 채널 관리가 먼저 필요하다.

### Channel

- [ ] Channel 엔티티 (channelId, orgId, type[DM/GROUP/CHANNEL], name, timestamps)
- [ ] ChannelMember 엔티티 (channelMemberId, channelId, userId, lastReadMessageId, timestamps)
- [ ] 1:1 DM 생성 API — 기존 DM 있으면 반환
- [ ] 그룹 채팅 생성 API
- [ ] 채널 생성 API (OWNER만)
- [ ] 내 채널 목록 조회 API (최근 메시지, 안읽은 수 포함)
- [ ] 채널 상세 조회 API (멤버 목록 포함)
- [ ] 채널 멤버 초대/퇴장 API
- [ ] 채널 나가기 API
- [ ] 채널 삭제 API
- [ ] Flyway 마이그레이션 (channels, channel_members 테이블)

---

## Phase 3: 메시지 (백엔드)

### Message CRUD

- [ ] Message 엔티티 (messageId, channelId, senderId, content, type[TEXT/IMAGE/FILE], timestamps)
- [ ] 메시지 전송 API (REST)
- [ ] 메시지 목록 조회 API (커서 기반 페이지네이션)
- [ ] 메시지 삭제 API (본인 메시지만)
- [ ] 메시지 검색 API (채널 내, 전체)
- [ ] Flyway 마이그레이션 (messages 테이블 + 인덱스)

### 실시간 통신

- [ ] WebSocket 엔드포인트 설정 (STOMP or raw WebSocket)
- [ ] 메시지 발송 시 WebSocket으로 실시간 전달
- [ ] 채널 구독/구독해제 로직
- [ ] 읽음 확인 (lastReadMessageId 업데이트 + 브로드캐스트)
- [ ] 접속 상태 관리 (Redis 기반)

### 파일 업로드

- [ ] File 엔티티 (fileId, uploaderId, fileName, fileSize, mimeType, s3Key, timestamps)
- [ ] 파일 업로드 API (MinIO/S3)
- [ ] 파일 다운로드/조회 API (presigned URL)
- [ ] 이미지 썸네일 생성 (선택)
- [ ] 메시지에 파일 첨부 연동
- [ ] Flyway 마이그레이션 (files 테이블)

---

## Phase 4: 모바일 앱 — 기반 구축

백엔드 API가 어느 정도 갖춰진 후 본격 진행.

### API 연동

- [ ] Orval 설정 + API 클라이언트 자동 생성
- [ ] Axios interceptor 정리 (base URL 환경변수화)

### 오프라인 DB

- [ ] SQLite 스키마 설계 (users, profiles, orgs, channels, messages)
- [ ] expo-sqlite 초기화 + 마이그레이션 구조
- [ ] 기본 CRUD 쿼리 함수

### 인증 UI

- [ ] 소셜 로그인 화면 구현 (카카오, 구글 — Supabase OAuth)
- [ ] 로그인 후 유저 등록 플로우 (서버에 유저 생성 호출)
- [ ] 로그아웃

---

## Phase 5: 모바일 앱 — Org/Team

### Org

- [ ] Org 목록 화면 (내가 속한 조직)
- [ ] Org 생성 화면
- [ ] 초대 코드 입력으로 Org 가입
- [ ] Org 설정/관리 화면 (OWNER)
- [ ] 멤버 목록 화면

### Team

- [ ] Team 목록 화면 (Org 내)
- [ ] Team 생성/관리 (OWNER)

### 프로필

- [ ] Org별 프로필 편집 화면
- [ ] 프로필 이미지 업로드

---

## Phase 6: 모바일 앱 — 메신저

### 채팅 목록

- [ ] 채널 목록 화면 (최근 메시지, 안읽은 수 표시)
- [ ] 새 대화 시작 (DM / 그룹 채팅 생성)
- [ ] 채널 검색

### 채팅방

- [ ] 채팅방 화면 (메시지 목록, 무한 스크롤)
- [ ] 메시지 입력/전송
- [ ] 이미지/파일 첨부 전송
- [ ] 메시지 삭제
- [ ] 읽음 확인 표시

### 실시간

- [ ] WebSocket 연결 관리
- [ ] 실시간 메시지 수신 + UI 반영
- [ ] 오프라인 → 온라인 복귀 시 동기화

### 검색

- [ ] 메시지 검색 화면

### 푸시 알림

- [ ] Expo Push Notification 설정
- [ ] 백엔드 푸시 발송 연동 (FCM/APNs)
- [ ] 알림 탭 시 해당 채팅방으로 이동

---

## Phase 7: 마무리 및 품질

- [ ] 에러 핸들링 전반 점검
- [ ] API 응답 일관성 점검
- [ ] 모바일 UX 전반 점검 (로딩, 에러, 빈 상태)
- [ ] 오프라인 동기화 안정성 테스트
- [ ] 배포 파이프라인 점검 (Docker 빌드, 환경변수)
- [ ] 기본 테스트 작성 (핵심 플로우)

---

## 진행 순서 요약

```
Phase 0  현재 작업 정리
Phase 1  Org/Team (백엔드)         ← 지금 여기서 시작
Phase 2  채널/채팅방 (백엔드)
Phase 3  메시지 + 실시간 + 파일 (백엔드)
Phase 4  모바일 기반 (API 연동, SQLite, 인증)
Phase 5  모바일 Org/Team
Phase 6  모바일 메신저
Phase 7  마무리
```

> Phase 4는 Phase 1~2와 병렬로 진행 가능 (API 스펙이 확정되면 Orval로 미리 생성)
