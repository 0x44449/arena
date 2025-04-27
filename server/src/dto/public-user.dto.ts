import { ApiProperty } from '@nestjs/swagger';
import { User } from '@prisma/client';
import { Exclude, Expose } from 'class-transformer';

export class PublicUserDto {
  @Exclude()
  userId: string;

  @ApiProperty()
  @Expose()
  email: string;

  @ApiProperty()
  @Expose()
  loginId: string;

  @ApiProperty()
  @Expose()
  displayName: string;

  @Exclude()
  password: string;

  @Exclude()
  avatarType: string;

  @Exclude()
  avatarKey: string;

  @ApiProperty()
  @Expose()
  avatarUrl: string;

  @ApiProperty()
  @Expose()
  createdAt: Date;
  
  @ApiProperty()
  @Expose()
  updatedAt: Date;

  constructor(input: Partial<PublicUserDto> | User) {
    Object.assign(this, input);

    if (this.avatarType === 'default') {
      this.avatarUrl = `/image/default-avatar/${this.avatarKey}`;
    }
    else {
      this.avatarUrl = `/image/user/${this.userId}/avatar/${this.avatarKey}`;
    }
  }
}
