import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateGroupChannelDto {
  @ApiProperty({ description: '그룹 이름', maxLength: 100 })
  @IsString()
  @MaxLength(100)
  name: string;

  @ApiPropertyOptional({ description: '초대할 유저 ID 목록' })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  userIds?: string[];

  @ApiPropertyOptional({ description: '그룹 아이콘 파일 ID' })
  @IsOptional()
  @IsString()
  iconFileId?: string;
}
