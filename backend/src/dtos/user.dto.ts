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
      message: entity.message,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
      avatarUrl: entity.avatarType === 'default'
        ? `/image/default-avatar/${entity.avatarKey}`
        : `${process.env.SERVER_BASE_URL}/api/v1/users/${entity.userId}/avatar/thumbnail.png?v=${entity.updatedAt ? Math.floor(entity.updatedAt.getTime() / 1000) : Math.floor(entity.createdAt.getTime() / 1000)
        }`,
    }
  }
}