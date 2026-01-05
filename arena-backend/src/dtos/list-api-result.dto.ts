import { Type } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { ApiResultDto } from './api-result.dto';

export class ListApiResultDto<T> extends ApiResultDto {
  data: T[];
}

export function withListApiResult<T>(
  Model: Type<T>,
  options?: { nullable?: boolean },
) {
  const { nullable = false } = options || {};

  class ListApiResultDtoWithModel extends ListApiResultDto<T> {
    @ApiProperty({
      type: () => Model,
      isArray: true,
      nullable: nullable,
    })
    declare data: T[];
  }
  Object.defineProperty(ListApiResultDtoWithModel, 'name', {
    value: `${Model.name}${nullable ? '_Nullable' : ''}_ListResult`,
  });
  return ListApiResultDtoWithModel;
}
