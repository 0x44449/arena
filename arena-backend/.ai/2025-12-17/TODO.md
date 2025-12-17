# Arena Backend - 미결정 사항 (TODO)

## API 설계 아이디어

### Query 패턴 (GraphQL-like)
**배경:**
- 채널 목록/상세 조회 시 participants 전체를 항상 내려주면 부담
- 그렇다고 API를 계속 늘리기도 애매
- GraphQL처럼 필요한 필드만 요청하는 방식 고려

**아이디어:**
```
POST /api/v1/channels/:id/query
{
  "include": ["participants", "memberCount"]
}
```

- 완전 자유로운 GraphQL이 아니라 허용된 옵션만 요청 가능
- 기본 REST는 유지하고, 복잡한 조회만 `/query`로
- 나중에 그룹 멤버 많아지면 도입 검토

---

## Channel 관련

### participants 최적화
- 현재는 모든 participants를 항상 반환
- 그룹 멤버가 많아지면 성능 이슈 가능
- Query 패턴 또는 페이지네이션 도입 검토

---

## 기존 TODO (2024-12-15에서 이관)

### Direct Channel - 나가기(Leave) 기능
**문제:**
- DM은 1:1인데 한쪽만 나가면?
- 카카오톡처럼 나가면 대화 내역 삭제?
- 숨기기만 하고 상대가 다시 메시지 보내면 복구?

**결론:** 메시지 기능 구현 후 다시 논의

### Group Channel 추가 기능
- 최대 인원 제한?
- 초대/강퇴 로직

### Team (미구현)
- 팀 기본 정보 (이름, 설명, 아이콘)
- 팀 멤버 역할 (owner, admin, member 또는 커스텀)
- 초대 방식 (코드, 링크, 직접 초대)
- 공개/비공개 팀

### Message (미구현)
- 메시지 기본 구조
- 파일 첨부
- 답장(reply)
- 수정/삭제
- 읽음 처리

### 기타
- 친구 시스템 필요 여부
- 알림 설정 (채널별 on/off, 음소거)
- 검색 (메시지, 유저, 채널)
