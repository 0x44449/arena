# Arena Backend - TODO

## 즉시 해야 할 것
- [ ] 클라이언트에서 API 연결 테스트
- [ ] 웹소켓 구현 (실시간 메시지)

## 클라이언트 상태 관리 결정
- [ ] React Query vs Zustand vs 조합 결정
- [ ] 정규화 구조 설계
- [ ] 웹소켓 연동 방식 결정

## Channel 관련
- [ ] Team Channel 구현
- [ ] 채널 나가기/삭제
- [ ] 초대/강퇴 로직

## Message 관련
- [ ] 파일 첨부
- [ ] 답장 (reply)
- [ ] 수정/삭제
- [ ] 읽음 처리

## Contact 관련
- [ ] 별명 (nickname) 기능
- [ ] 즐겨찾기/차단 기능 (필요시)

## 기타
- [ ] participants 많아지면 Query 패턴 또는 페이지네이션 도입

## 구조 개선 (나중에)
- [ ] MessageService에서 DTO 변환 제거 (레이어 원칙 준수)
  - 현재: Service에서 직접 ArenaGateway 호출 + DTO 변환
  - 개선: EventEmitter로 이벤트 발행, Gateway에서 구독 후 DTO 변환
  - 참고: src/modules/message/message.service.ts의 TODO 주석
