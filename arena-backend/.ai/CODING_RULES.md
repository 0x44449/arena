# Arena Backend - 코딩 룰

## 1. 공통 함수 추출 금지

- 공통으로 보이는 로직이라도 임의로 별도 함수로 빼지 않는다
- 각 위치에서 인라인으로 구현한다
- 공통 함수가 필요하면 Zina가 직접 요청할 때만 추출한다

**이유:** 섣부른 추상화보다 명시적인 코드가 낫다. 실제로 중복이 문제가 될 때 리팩토링한다.

## 2. DTO 분류

- `src/dtos/` (최상위): 클라이언트로 내려주는 응답 DTO
- `src/modules/*/dtos/` (모듈 하위): 해당 모듈 내에서만 사용하는 DTO (요청, 내부 타입 등)

## 3. API 응답 형식

- 단건: `SingleApiResultDto<T>`
- 목록: `ListApiResultDto<T>`
- 무한스크롤: `InfinityListApiResultDto<T>` (hasNext, hasPrev 포함)
- 데이터 없는 응답: `ApiResultDto`

## 4. 컨트롤러 라우팅 패턴

- 컨트롤러 클래스에 base path 설정: `@Controller("/api/v1/리소스명")`
- 메서드에 상세 경로 설정
- 다른 리소스 종속적인 경우: `/api/v1/messages/channel/:channelId` 형태로 하위 경로에 명시
