# Arena Backend - 설계 결정 기록

## 채널 타입 분리 (2024-12-15)

### 결정
채널을 `direct`, `group`, `team` 세 타입으로 분리

### 배경
- 초기에는 "보이지 않는 public 팀"으로 DM/그룹챗을 처리하려 했음
- 하지만 타입별 로직이 너무 달라서 분리가 명확함

### 구조
```
channels (공통 테이블)
├── direct_channels (1:1 확장)
├── group_channels (그룹 확장)
└── team_channels (팀 확장)

participants (공통 테이블)
├── direct_participants
├── group_participants
└── team_participants
```

---

## 공통 테이블 + 확장 테이블 (2024-12-15)

### 결정
Single Table Inheritance 대신 별도 테이블 + relation 방식

### 이유
- nullable 필드 최소화
- 타입별 로직 분리 용이
- 확장성 좋음

### 트레이드오프
- 조회 시 join 필요
- 하지만 서비스 레이어에서 처리 가능

---

## Mapper 순수 함수 (2024-12-15)

### 결정
Mapper는 순수 함수로 유지, DI 사용 안 함

### 이유
- 단순함 유지
- 테스트 용이
- 비동기 로직은 controller 책임

### 예시
```typescript
// Controller
const avatar = entity.avatar 
  ? await toFileDto(entity.avatar, this.s3Service) 
  : null;
return toUserDto(entity, avatar);
```

---

## ID 체계 - nanoid(12) (2024-12-15)

### 결정
UUID 대신 nanoid(12) 사용

### 이유
- URL-safe (하이픈 없음)
- 더 짧음 (12자)
- 충돌 확률 충분히 낮음

### 형식
- 숫자(0-9) + 대문자(A-Z) + 소문자(a-z)
- 예: `aB3dE7fG9hJ2`

---

## 파일 참조 방식 (2024-12-15)

### 결정
S3 key 직접 저장 대신 FileEntity FK 사용

### 변경
- `UserEntity.avatarKey` → `UserEntity.avatarFileId`
- `FileEntity`와 relation으로 연결

### 이유
- 파일 메타데이터 일관성
- 삭제/교체 시 추적 용이
