import { UserEntity } from 'src/entities/user.entity';
import { UserDto } from 'src/dtos/user.dto';
import { toFileDto } from './file.mapper';

export function toUserDto(entity: UserEntity): UserDto {
  return {
    userId: entity.userId,
    utag: entity.utag,
    nick: entity.nick,
    avatar: entity.avatar ? toFileDto(entity.avatar) : null,
    email: entity.email,
    statusMessage: entity.statusMessage,
    createdAt: entity.createdAt,
    updatedAt: entity.updatedAt,
  };
}
