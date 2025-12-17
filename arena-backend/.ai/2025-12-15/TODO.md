# Arena Backend - 미결정 사항 (TODO) - 2024-12-15

## Direct Channel

### 나가기(Leave) 기능
**문제:**
- DM은 1:1인데 한쪽만 나가면?
- 카카오톡처럼 나가면 대화 내역 삭제?
- 숨기기만 하고 상대가 다시 메시지 보내면 복구?

**결론:** 메시지 기능 구현 후 다시 논의

---

## Group Channel (미구현)

### 설계 필요
- 그룹 이름, 아이콘
- 최대 인원 제한?
- 방장(owner) 권한
- 초대/강퇴 로직

### 테이블 구조 (예상)
```typescript
GroupChannelEntity {
  channelId: string;
  channel: ChannelEntity;
  iconFileId: string | null;
  maxMembers: number | null;
}

GroupParticipantEntity {
  channelId: string;
  userId: string;
  participant: ParticipantEntity;
  role: "owner" | "member";
  nickname: string | null;
}
```

---

## Team (미구현)

### 설계 필요
- 팀 기본 정보 (이름, 설명, 아이콘)
- 팀 멤버 역할 (owner, admin, member 또는 커스텀)
- 초대 방식 (코드, 링크, 직접 초대)
- 공개/비공개 팀
- 팀 태그 (utag처럼 ttag?)

### 테이블 구조 (예상)
```typescript
TeamEntity {
  teamId: string;
  name: string;
  description: string | null;
  iconFileId: string | null;
  ownerId: string;
  isPublic: boolean;
  // ...
}

TeamMemberEntity {
  teamId: string;
  userId: string;
  role: string;
  // ...
}

TeamChannelEntity {
  channelId: string;
  channel: ChannelEntity;
  // 팀 채널 전용 설정
}

TeamParticipantEntity {
  channelId: string;
  userId: string;
  participant: ParticipantEntity;
  // 팀 채널 참여자 전용 필드
}
```

---

## Message (미구현)

### 설계 필요
- 메시지 기본 구조
- 파일 첨부
- 답장(reply)
- 수정/삭제
- 읽음 처리

### 테이블 구조 (예상)
```typescript
MessageEntity {
  messageId: string;
  channelId: string;
  senderId: string;
  content: string;
  replyToId: string | null;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}
```

---

## 기타

### 친구 시스템
- 필요한가?
- DM은 친구만 가능? 아니면 아무나?

### 알림 설정
- 채널별 알림 on/off
- 음소거 기능

### 검색
- 메시지 검색
- 유저 검색
- 채널 검색
