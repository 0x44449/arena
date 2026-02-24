# Arena MVP TODO

MVP 목표: **코어(메신저 + Org/Team 관리)를 완성도 높게 구현**

> **핵심 설계**: Profile 기반 시스템. User는 인증용, 모든 활동은 profileId 기준.

---

## Phase 0: 프로젝트 스캐폴드 ✅

- [x] 모노레포 스캐폴드 (apps/backend, apps/mobile, infra/docker)
- [x] Docker Compose 환경 구성 (PostgreSQL, Redis, MinIO, API)
- [x] 백엔드 스캐폴드 (Spring Boot 3.5, Java 21, Security, Swagger)
- [x] Supabase JWT 인증 연동 (OAuth2 Resource Server + JWKS)
- [x] 공통 응답 DTO (ApiResult, SingleApiResult, ListApiResult, InfinityListApiResult)
- [x] 공통 예외 처리 (WellKnownException, GlobalExceptionHandler)
- [x] IdGenerator (SecureRandom 12-char)
- [x] User 도메인 (가입, 내 정보 조회)
- [x] Profile 도메인 (기본 프로필, 수정)
- [x] Flyway 마이그레이션 (V1: users, profiles)
- [x] 모바일 스캐폴드 (Expo Router, Supabase 연동, Zustand auth store)

---

## Phase 1: Org/Team 관리 (백엔드) ✅

### Org

- [x] Org 엔티티 + Flyway V2 (orgs, invite_codes)
- [x] Org 생성 API — 생성자의 Profile에 OWNER role 부여
- [x] 내 Org 목록 API (Profile 기반 조회)
- [x] Org 상세/수정 API (OWNER만 수정)
- [x] 초대 코드 생성/목록/삭제 API (OWNER만)
- [x] 초대 코드로 가입 API — Org용 Profile 자동 생성 (USER role)
- [x] 멤버 목록 API (ProfileDto 반환)
- [x] 멤버 추방 API (OWNER만, profileId 기준)
- [x] Org 탈퇴 API (OWNER 탈퇴 불가)

### Team

- [x] Team 엔티티 + Flyway V3 (teams, team_members)
- [x] Team CRUD API (생성/목록/상세/수정/삭제 — OWNER만)
- [x] Team 멤버 추가/목록/제거 API (profileId 기반, Org 멤버만 추가 가능)

### Profile 기반 전환

- [x] OrgMember 제거 → Profile이 Org 멤버십 겸임 (role: OWNER/USER)
- [x] TeamMember, ChannelMember: userId → profileId 전환
- [x] Flyway V5 (org_members DROP, 컬럼 리네이밍)

---

## Phase 2: 대화방 (백엔드) ✅

DM(1:1)과 그룹 채팅만 구현. 채널형 대화방은 성격 정의 후 별도 진행.

- [x] Channel 엔티티 + Flyway V4 (channels, channel_members)
- [x] DM 생성 API — 기존 DM 있으면 반환, 자기 자신 DM 차단
- [x] 그룹 채팅 생성 API (이름 + 초기 멤버 profileIds)
- [x] 내 대화방 목록 API (멤버 프로필 포함)
- [x] 대화방 상세 API (멤버 목록 포함)
- [x] 그룹 멤버 초대 API (DM은 차단)
- [x] 대화방 나가기 API (DM은 차단)

---

## Phase 3: 메시지 (백엔드) ← 다음

### Message CRUD

- [ ] Message 엔티티 (messageId, channelId, senderProfileId, content, type[TEXT/IMAGE/FILE], timestamps)
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

- [ ] File 엔티티 (fileId, uploaderProfileId, fileName, fileSize, mimeType, s3Key, timestamps)
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

- [ ] 대화방 목록 화면 (최근 메시지, 안읽은 수 표시)
- [ ] 새 대화 시작 (DM / 그룹 채팅 생성)

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
Phase 0  프로젝트 스캐폴드            ✅
Phase 1  Org/Team (백엔드)           ✅
Phase 2  대화방 (백엔드)              ✅
Phase 3  메시지 + 실시간 + 파일 (백엔드) ← 다음
Phase 4  모바일 기반 (API 연동, SQLite, 인증)
Phase 5  모바일 Org/Team
Phase 6  모바일 메신저
Phase 7  마무리
```

> Phase 4는 Phase 3와 병렬로 진행 가능 (API 스펙이 확정되면 Orval로 미리 생성)
