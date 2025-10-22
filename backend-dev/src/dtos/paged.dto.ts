import { Type } from "@nestjs/common";
import { ApiProperty } from "@nestjs/swagger";

export class PagedDto<T> {
  items: T[];
  total: number
  page: number;
  pageSize: number;
}

export function withPaged<T>(Model: Type<T>) {
  class PagedDtoWithModel extends PagedDto<T> {
    @ApiProperty({
      type: () => [Model],
    })
    declare items: T[];
  }

  Object.defineProperty(PagedDtoWithModel, 'name', { value: `PagedDto_${Model.name}` });

  return PagedDtoWithModel;
}