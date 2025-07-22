import { ApiProperty } from "@nestjs/swagger";

export class InfinityPagedDto<T> {
  @ApiProperty() items: T[];
  @ApiProperty() hasNext: boolean;
  @ApiProperty() hasPrev: boolean;

  constructor(parma?: { items?: T[]; hasNext?: boolean; hasPrev?: boolean }) {
    this.items = parma?.items || [];
    this.hasNext = parma?.hasNext || false;
    this.hasPrev = parma?.hasPrev || false;
  }
}