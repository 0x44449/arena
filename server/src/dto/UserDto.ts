import { AvatarType, User } from '@prisma/client';
import { Exclude } from 'class-transformer';

export class UserDto {
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

  constructor(input: Partial<UserDto> | User) {
    Object.assign(this, input);
  }
}