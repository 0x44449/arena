# Arena App - 설계 결정 기록

## 2026-01-12

### 1. chat-room 리스트에 LegendList 시험 도입

**배경**
- 키보드 표시 시 하단 메시지 유지가 불안정
- 기존 리스트 구성만으로는 scroll 유지가 어려움

**결론**
- `@legendapp/list`의 `LegendList`를 사용해 키보드/스크롤 유지 동작을 테스트
- 결과에 따라 유지 여부 재결정 예정
