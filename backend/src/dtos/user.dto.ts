import { UserEntity } from "@/entities/user.entity";
import { OmitType } from "@nestjs/swagger";
import { plainToInstance } from "class-transformer";

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
    const dto = plainToInstance(UserDto, entity, {
      excludeExtraneousValues: true,
    });

    if (entity.avatarType === 'default') {
      dto.avatarUrl = `/image/default-avatar/${entity.avatarKey}`;
    }
    else {
      dto.avatarUrl = `${process.env.SERVER_BASE_URL}/api/v1/users/${entity.userId}/avatar/thumbnail.png`;
    }

    return dto;
  }
}