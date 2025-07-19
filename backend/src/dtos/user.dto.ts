import { UserEntity } from "@/entities/user.entity";
import { OmitType } from "@nestjs/swagger";

export class UserDto extends OmitType(
  UserEntity,
  [
    'uid',
    'provider',
    'avatarType',
    'avatarKey',
  ] as const
) {
  avatarUrl: string;

  public static fromEntity(entity: UserEntity): UserDto {
    return {
      userId: entity.userId,
      email: entity.email,
      displayName: entity.displayName,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
      avatarUrl: entity.avatarType === 'default'
        ? `/image/default-avatar/${entity.avatarKey}`
        : `${process.env.SERVER_BASE_URL}/api/v1/users/${entity.userId}/avatar/thumbnail.png`,
    }
  }
}