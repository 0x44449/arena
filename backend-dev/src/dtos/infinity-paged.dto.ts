import { Type } from "@nestjs/common";
import { ApiProperty } from "@nestjs/swagger";

export class InfinityPagedDto<T> {
  items: T[];
  hasNext: boolean;
  hasPrev: boolean;

  constructor(parma?: { items?: T[]; hasNext?: boolean; hasPrev?: boolean }) {
    this.items = parma?.items || [];
    this.hasNext = parma?.hasNext || false;
    this.hasPrev = parma?.hasPrev || false;
  }
}

export function withInfinityPaged<T>(Model: Type<T>) {
  class InfinityPagedDtoWithModel extends InfinityPagedDto<T> {
    @ApiProperty({
      type: () => [Model],
    })
    declare items: T[];
  }

  Object.defineProperty(InfinityPagedDtoWithModel, 'name', { value: `InfinityPagedDto_${Model.name}` });

  return InfinityPagedDtoWithModel;
}
