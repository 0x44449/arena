import { AvatarType, User } from '@prisma/client';
import { Exclude } from 'class-transformer';

export class PublicUserDto {
  @Exclude()
  userId: string;
  email: string;
  loginId: string;
  displayName: string;
  @Exclude()
  password: string;
  @Exclude()
  avatarType: AvatarType;
  @Exclude()
  avatarKey: string;
  avatarUrl: string;
  createdAt: Date;
  updatedAt: Date;

  constructor(input: Partial<PublicUserDto> | User) {
    Object.assign(this, input);

    if (this.avatarType === AvatarType.default) {
      this.avatarUrl = `/image/default-avatar/${this.avatarKey}`;
    }
    else {
      this.avatarUrl = `/image/user/${this.userId}/avatar/${this.avatarKey}`;
    }
  }
}
