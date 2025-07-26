import { applyDecorators, Type } from "@nestjs/common";
import { ApiBody, ApiConsumes } from "@nestjs/swagger";

export function ApiMultipartsBody<T>(dtoClass?: Type<T>) {
  // 기본 파일 필드
  const properties: any = {
    files: {
      type: 'array',
      items: {
        type: 'string',
        format: 'binary',
      }
    }
  };

  if (dtoClass) {
    // DTO 클래스의 메타데이터에서 프로퍼티 정보 추출
    const metadataKeys = Reflect.getMetadataKeys(dtoClass.prototype) || [];

    // 각 프로퍼티의 정보를 가져와서 스키마에 추가
    Object.getOwnPropertyNames(new dtoClass()).forEach(propertyKey => {
      if (propertyKey !== 'files') {
        // 기본적으로 string으로 설정 (multipart에서는 모든 값이 문자열로 전송됨)
        properties[propertyKey] = {
          type: 'string',
          required: false
        };
      }
    });
  }

  return applyDecorators(
    ApiConsumes('multipart/form-data'),
    ApiBody({
      schema: {
        type: 'object',
        properties,
        required: ['files']
      }
    })
  );
}