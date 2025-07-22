import { ApiProperty } from "@nestjs/swagger";

export class PagedDto<T> {
  @ApiProperty() items: T[];
  @ApiProperty() total: number;
  @ApiProperty() page: number;
  @ApiProperty() pageSize: number;
}