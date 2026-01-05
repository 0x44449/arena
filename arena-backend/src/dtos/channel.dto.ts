import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { FileDto } from './file.dto';
import { ParticipantDto } from './participant.dto';

export class ChannelDto {
  @ApiProperty({ description: '채널 ID' })
  channelId: string;

  @ApiProperty({
    description: '채널 타입',
    enum: ['direct', 'group', 'team'],
  })
  type: 'direct' | 'group' | 'team';

  @ApiPropertyOptional({
    type: String,
    nullable: true,
    description: '채널 이름 (DM은 null)',
  })
  name: string | null;

  @ApiPropertyOptional({
    type: () => FileDto,
    nullable: true,
    description: '채널 아이콘 (DM은 null)',
  })
  icon: FileDto | null;

  @ApiProperty({
    type: () => [ParticipantDto],
    description: '참여자 목록',
  })
  participants: ParticipantDto[];

  @ApiPropertyOptional({
    type: Date,
    nullable: true,
    description: '마지막 메시지 시간',
  })
  lastMessageAt: Date | null;

  @ApiProperty({ description: '생성 시간' })
  createdAt: Date;

  @ApiProperty({ description: '수정 시간' })
  updatedAt: Date;
}
