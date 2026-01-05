import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { FileDto } from './file.dto';

export class UserDto {
  @ApiProperty({ description: '유저 ID' })
  userId: string;

  @ApiProperty({ description: '유저 태그' })
  utag: string;

  @ApiProperty({ description: '닉네임' })
  nick: string;

  @ApiPropertyOptional({
    type: () => FileDto,
    nullable: true,
    description: '프로필 이미지',
  })
  avatar: FileDto | null;

  @ApiPropertyOptional({
    type: String,
    nullable: true,
    description: '이메일',
  })
  email: string | null;

  @ApiPropertyOptional({
    type: String,
    nullable: true,
    description: '상태 메시지',
  })
  statusMessage: string | null;

  @ApiProperty({ description: '생성 시간' })
  createdAt: Date;

  @ApiProperty({ description: '수정 시간' })
  updatedAt: Date;
}
