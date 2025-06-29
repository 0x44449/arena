import { UserEntity } from '@/entity/user.entity';
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
  avatarType: string;
  @Exclude()
  avatarKey: string;

  avatarUrl: string;
  createdAt: Date;
  updatedAt: Date;

  constructor(input: Partial<PublicUserDto> | UserEntity) {
    Object.assign(this, input);

    if (this.avatarType === 'default') {
      this.avatarUrl = `/image/default-avatar/${this.avatarKey}`;
    }
    else {
      this.avatarUrl = `${process.env.SERVER_BASE_URL}/api/v1/users/${this.userId}/avatar/thumbnail.png`;
    }
  }

  static fromEntity(entity: UserEntity): PublicUserDto {
    const instance = new PublicUserDto(entity);
    return instance;
  }
}
