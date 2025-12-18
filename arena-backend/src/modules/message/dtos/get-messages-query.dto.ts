import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsOptional, IsString, IsInt, Min, Max } from "class-validator";
import { Type } from "class-transformer";

export class GetMessagesQueryDto {
  @ApiPropertyOptional({ description: "이 메시지 이전 (이 메시지 미포함)" })
  @IsOptional()
  @IsString()
  before?: string;

  @ApiPropertyOptional({ description: "이 메시지 이후 (이 메시지 미포함)" })
  @IsOptional()
  @IsString()
  after?: string;

  @ApiPropertyOptional({ description: "이 메시지 기준 앞뒤로 조회 (이 메시지 포함)" })
  @IsOptional()
  @IsString()
  around?: string;

  @ApiPropertyOptional({ description: "가져올 개수 (기본 50, 최대 100)" })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number;
}
