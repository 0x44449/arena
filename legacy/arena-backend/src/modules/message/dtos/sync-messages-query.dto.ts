import { ApiProperty } from '@nestjs/swagger';
import { IsDateString } from 'class-validator';

export class SyncMessagesQueryDto {
  @ApiProperty({ description: '이 시간 이후 변경된 메시지 조회 (ISO 8601)' })
  @IsDateString()
  since: string;
}
