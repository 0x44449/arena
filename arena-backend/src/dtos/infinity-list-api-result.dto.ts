import { Type } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { ApiResultDto } from './api-result.dto';

export class InfinityListApiResultDto<T> extends ApiResultDto {
  data: T[];
  hasNext: boolean;
  hasPrev: boolean;
}

export function withInfinityListApiResult<T>(Model: Type<T>) {
  class InfinityListApiResultDtoWithModel extends InfinityListApiResultDto<T> {
    @ApiProperty({
      type: () => Model,
      isArray: true,
    })
    declare data: T[];

    @ApiProperty({ description: '다음 데이터 존재 여부' })
    declare hasNext: boolean;

    @ApiProperty({ description: '이전 데이터 존재 여부' })
    declare hasPrev: boolean;
  }
  Object.defineProperty(InfinityListApiResultDtoWithModel, 'name', {
    value: `${Model.name}_InfinityListResult`,
  });
  return InfinityListApiResultDtoWithModel;
}
